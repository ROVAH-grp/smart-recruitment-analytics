import { useState } from "react";
import { getApplication } from "../../api/applications";
import {
  cancelInterviewRound, confirmHire, getAiReport, getInterviewRounds, getOffers, getStageHistory,
  moveApplication, openInterviewRound, retryOnboarding, submitScorecard,
} from "../../api/pipeline";
import type { AiReport, InterviewRound, OfferLetter } from "../../api/pipeline";
import {
  Btn, Empty, Field, Loading, Messages, Modal, Notice, Panel, Pill, Timeline, fmtDate, fmtDateTime,
  inputStyle, money, statusTone, useAction, useLoad,
} from "../../components/ui";

const REJECTABLE = ["Applied", "Screened", "Shortlisted", "Interviewed", "Selected"];

export default function WorkflowPanel({
  applicationId, onClose, onChanged,
}: { applicationId: string; onClose: () => void; onChanged: () => void }) {
  const { data, error, loading, reload } = useLoad(async () => {
    const [application, history, interviews, offers] = await Promise.all([
      getApplication(applicationId),
      getStageHistory(applicationId),
      getInterviewRounds(applicationId),
      getOffers(applicationId),
    ]);
    // The AI report only exists after the candidate uploaded a resume.
    let report: AiReport | null = null;
    try {
      report = await getAiReport(applicationId);
    } catch {
      report = null;
    }
    return { application, history, interviews, offers, report };
  }, [applicationId]);

  const changed = async () => {
    await reload();
    onChanged();
  };

  const status = data?.application.status ?? "Applied";

  return (
    <Modal
      width={1000}
      onClose={onClose}
      title={
        data ? (
          <span>
            {data.application.candidate?.candidateName ?? data.application.candidateId}
            <span style={{ fontWeight: 500, color: "var(--text-secondary)" }}> · {data.application.job?.jobTitle ?? data.application.jobId} · #{applicationId}</span>
          </span>
        ) : `Application #${applicationId}`
      }
    >
      {loading && !data && <Loading />}
      {error && <Notice kind="error">{error}</Notice>}
      {data && (
        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <Pill tone={statusTone(status)}>{status}</Pill>
            <span style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>
              Applied {fmtDate(data.application.applicationDate)}
              {data.application.matchScore !== null && <> · AI match {Math.round(Number(data.application.matchScore))}%</>}
            </span>
          </div>

          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", alignItems: "start" }}>
            <div style={{ display: "grid", gap: 16 }}>
              <Panel title="What happened so far">
                <Timeline
                  events={data.history.timeline.map((e) => ({
                    title: <>{e.from ? `${e.from} → ` : ""}{e.to}</>,
                    detail: e.reason,
                    meta: `${fmtDateTime(e.at)} · ${e.by === "SYSTEM" ? "automatic" : e.by}`,
                  }))}
                />
              </Panel>
              <ReportSection report={data.report} />
            </div>

            <div style={{ display: "grid", gap: 16 }}>
              <StageActions applicationId={applicationId} status={status} onChanged={changed} />

              {["Shortlisted", "Interviewed"].includes(status) || data.interviews.rounds.length > 0 ? (
                <RoundsSection
                  applicationId={applicationId}
                  status={status}
                  rounds={data.interviews.rounds}
                  plan={data.interviews.roundPlan}
                  passMark={data.interviews.passMark}
                  onChanged={changed}
                />
              ) : null}

              <HireSection
                applicationId={applicationId}
                status={status}
                offers={data.offers.offers}
                onChanged={changed}
              />
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

/* --------------------------- AI report --------------------------- */

function ReportSection({ report }: { report: AiReport | null }) {
  if (!report) {
    return (
      <Panel title="AI analysis report">
        <Empty>No report yet. It appears after the candidate uploads a resume.</Empty>
      </Panel>
    );
  }
  return (
    <Panel title="AI analysis report">
      <div style={{ display: "flex", gap: 14, alignItems: "baseline", flexWrap: "wrap" }}>
        <div style={{ fontSize: 30, fontWeight: 800, color: "var(--text)" }}>{Math.round(report.overallScore)}<span style={{ fontSize: 14, color: "var(--text-secondary)" }}>/100</span></div>
        {report.skillCoverage !== null && <Pill tone="accent">{report.skillCoverage}% of required skills</Pill>}
      </div>
      <div style={{ fontSize: 13, color: "var(--text)", margin: "6px 0 12px", fontWeight: 600 }}>{report.recommendation}</div>
      <SkillList title="Matched skills" skills={report.matchedSkills} tone="green" />
      <SkillList title="Missing skills" skills={report.missingSkills} tone="red" />
    </Panel>
  );
}

function SkillList({ title, skills, tone }: { title: string; skills: string[]; tone: "green" | "red" }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 4 }}>{title.toUpperCase()}</div>
      {skills.length === 0 ? (
        <span style={{ fontSize: 12.5, color: "var(--text-tertiary)" }}>None</span>
      ) : (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {skills.map((skill) => <Pill key={skill} tone={tone}>{skill}</Pill>)}
        </div>
      )}
    </div>
  );
}

/* ------------------------- manual stage moves -------------------------- */

function StageActions({
  applicationId, status, onChanged,
}: { applicationId: string; status: string; onChanged: () => void }) {
  const [reason, setReason] = useState("");
  const action = useAction();

  const move = (toStatus: "Screened" | "Shortlisted" | "Rejected") =>
    action.run(async () => {
      await moveApplication(applicationId, toStatus, reason.trim());
      setReason("");
      onChanged();
      return `Application moved to ${toStatus}.`;
    });

  const canScreen = status === "Applied";
  const canShortlist = status === "Screened";
  const canReject = REJECTABLE.includes(status);
  if (!canScreen && !canShortlist && !canReject) return null;

  return (
    <Panel title="Decision">
      <Field label="Reason (optional)">
        <input style={inputStyle} value={reason} onChange={(e) => setReason(e.target.value)} maxLength={255} placeholder="Why are you making this decision?" />
      </Field>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {canScreen && <Btn small disabled={action.busy} onClick={() => move("Screened")}>Mark as screened</Btn>}
        {canShortlist && <Btn small kind="success" disabled={action.busy} onClick={() => move("Shortlisted")}>Shortlist</Btn>}
        {canReject && (
          <Btn small kind="danger" disabled={action.busy} onClick={() => { if (window.confirm("Reject this application? The candidate will be emailed.")) void move("Rejected"); }}>
            Reject
          </Btn>
        )}
      </div>
      <Messages error={action.error} success={action.success} />
    </Panel>
  );
}

/* ------------------------------ interviews ----------------------------- */

function RoundsSection({
  applicationId, status, rounds, plan, passMark, onChanged,
}: {
  applicationId: string;
  status: string;
  rounds: InterviewRound[];
  plan: string[];
  passMark?: number;
  onChanged: () => void;
}) {
  const active = rounds.filter((r) => r.status !== "CANCELLED");
  const openRound = active.find((r) => r.status === "PROPOSED" || r.status === "SCHEDULED");
  const passed = active.filter((r) => r.result === "PASS").length;
  const canOpen = ["Shortlisted", "Interviewed"].includes(status) && !openRound && passed < plan.length;

  return (
    <Panel title={`Interviews${passMark !== undefined ? ` (pass mark ${passMark})` : ""}`}>
      <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 10 }}>
        Rounds in order: {plan.join(" → ")}
      </div>
      {rounds.length === 0 && <Empty>No interview round has been opened yet.</Empty>}
      <div style={{ display: "grid", gap: 10 }}>
        {rounds.map((round) => <RoundRow key={round.roundId} round={round} onChanged={onChanged} />)}
      </div>
      {canOpen && <OpenRoundForm applicationId={applicationId} nextName={plan[passed]} onChanged={onChanged} />}
    </Panel>
  );
}

function RoundRow({ round, onChanged }: { round: InterviewRound; onChanged: () => void }) {
  const cancel = useAction();
  const [showScore, setShowScore] = useState(false);

  return (
    <div style={{ border: "1px solid var(--border)", background: "var(--bg-elevated)", borderRadius: 10, padding: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--text)" }}>Round {round.roundNumber}: {round.roundName}</div>
        <div style={{ display: "flex", gap: 6 }}>
          <Pill tone={statusTone(round.status)}>{round.status}</Pill>
          {round.result && <Pill tone={statusTone(round.result)}>{round.result}</Pill>}
        </div>
      </div>

      {round.status === "PROPOSED" && (
        <div style={{ fontSize: 12.5, color: "var(--text)", marginTop: 6 }}>
          Waiting for the candidate to choose one of: {(round.proposedSlots ?? []).map((s) => fmtDateTime(s)).join(" | ")}
        </div>
      )}
      {round.status === "SCHEDULED" && (
        <div style={{ fontSize: 12.5, color: "var(--text)", marginTop: 6 }}>
          Booked for <strong>{fmtDateTime(round.scheduledAt)}</strong> · {round.mode}
          {round.meetingLink ? ` · ${round.meetingLink}` : ""}
        </div>
      )}
      {round.status === "COMPLETED" && (
        <div style={{ fontSize: 12.5, color: "var(--text)", marginTop: 6, lineHeight: 1.6 }}>
          Technical {round.technicalScore} · Communication {round.communicationScore} · Problem solving {round.problemSolvingScore}
          <br /><strong>Overall {round.overallScore}</strong>{round.feedback ? ` · "${round.feedback}"` : ""}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
        {round.status === "SCHEDULED" && <Btn small onClick={() => setShowScore(!showScore)}>{showScore ? "Hide scorecard" : "Enter scorecard"}</Btn>}
        {(round.status === "PROPOSED" || round.status === "SCHEDULED") && (
          <Btn small kind="danger" disabled={cancel.busy}
            onClick={() => { if (window.confirm("Cancel this round? The candidate will be told.")) void cancel.run(async () => { await cancelInterviewRound(round.roundId); onChanged(); return "Round cancelled."; }); }}>
            Cancel round
          </Btn>
        )}
      </div>
      {showScore && round.status === "SCHEDULED" && <ScorecardForm roundId={round.roundId} onChanged={onChanged} />}
      <Messages error={cancel.error} success={cancel.success} />
    </div>
  );
}

function ScorecardForm({ roundId, onChanged }: { roundId: string; onChanged: () => void }) {
  const [technical, setTechnical] = useState("");
  const [communication, setCommunication] = useState("");
  const [problem, setProblem] = useState("");
  const [feedback, setFeedback] = useState("");
  const action = useAction();

  const valid = [technical, communication, problem].every((v) => v !== "" && Number(v) >= 0 && Number(v) <= 100);

  const submit = () =>
    action.run(async () => {
      const result = await submitScorecard(roundId, {
        technicalScore: Number(technical),
        communicationScore: Number(communication),
        problemSolvingScore: Number(problem),
        feedback: feedback.trim() || undefined,
      });
      onChanged();
      if (result.outcome === "REJECTED") return `Overall ${result.overallScore} is below the pass mark of ${result.passMark}. The application was rejected and the candidate was emailed.`;
      if (result.outcome === "SELECTED") return `Overall ${result.overallScore}. The candidate cleared the final round and is now Selected. You can confirm the hire.`;
      return `Overall ${result.overallScore}. The candidate cleared this round. Next: ${result.nextRound}.`;
    });

  const num = (value: string, set: (v: string) => void, label: string) => (
    <Field label={label}>
      <input type="number" min={0} max={100} style={inputStyle} value={value} onChange={(e) => set(e.target.value)} />
    </Field>
  );

  return (
    <div style={{ marginTop: 10, borderTop: "1px solid var(--border)", paddingTop: 10 }}>
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(3, 1fr)" }}>
        {num(technical, setTechnical, "Technical (0-100)")}
        {num(communication, setCommunication, "Communication (0-100)")}
        {num(problem, setProblem, "Problem solving (0-100)")}
      </div>
      <Field label="Feedback (only recruiters see this)">
        <textarea style={{ ...inputStyle, minHeight: 56 }} maxLength={500} value={feedback} onChange={(e) => setFeedback(e.target.value)} />
      </Field>
      <Btn disabled={!valid || action.busy} onClick={submit}>{action.busy ? "Saving..." : "Submit scorecard"}</Btn>
      <Messages error={action.error} success={action.success} />
    </div>
  );
}

function OpenRoundForm({
  applicationId, nextName, onChanged,
}: { applicationId: string; nextName: string; onChanged: () => void }) {
  const [slots, setSlots] = useState<string[]>(["", ""]);
  const [mode, setMode] = useState("Online");
  const [link, setLink] = useState("");
  const action = useAction();

  const filled = slots.filter(Boolean);
  const nowLocal = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);

  const submit = () =>
    action.run(async () => {
      await openInterviewRound(applicationId, {
        slots: filled.map((s) => new Date(s).toISOString()),
        mode,
        meetingLink: link.trim() || undefined,
      });
      setSlots(["", ""]);
      setLink("");
      onChanged();
      return "Round opened. The candidate was emailed the time options.";
    });

  return (
    <div style={{ marginTop: 14, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text)", marginBottom: 8 }}>Open the {nextName} round</div>
      {slots.map((slot, i) => (
        <Field key={i} label={`Time option ${i + 1}${i === 0 ? "" : " (optional)"}`}>
          <input type="datetime-local" min={nowLocal} style={inputStyle} value={slot}
            onChange={(e) => setSlots(slots.map((s, j) => (j === i ? e.target.value : s)))} />
        </Field>
      ))}
      {slots.length < 5 && <div style={{ marginBottom: 12 }}><Btn small kind="ghost" onClick={() => setSlots([...slots, ""])}>+ Add another time</Btn></div>}
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 2fr" }}>
        <Field label="Format">
          <select style={inputStyle} value={mode} onChange={(e) => setMode(e.target.value)}>
            <option>Online</option>
            <option>Onsite</option>
          </select>
        </Field>
        <Field label={mode === "Online" ? "Meeting link" : "Address"}>
          <input style={inputStyle} value={link} maxLength={255} onChange={(e) => setLink(e.target.value)} placeholder={mode === "Online" ? "https://meet.google.com/..." : "Office address"} />
        </Field>
      </div>
      <Btn disabled={filled.length === 0 || action.busy} onClick={submit}>{action.busy ? "Sending..." : "Send time options to the candidate"}</Btn>
      <Messages error={action.error} success={action.success} />
    </div>
  );
}

/* --------------------------- hire and offer ---------------------------- */

function HireSection({
  applicationId, status, offers, onChanged,
}: { applicationId: string; status: string; offers: OfferLetter[]; onChanged: () => void }) {
  const latest = offers[0];
  const expired = latest && (latest.status === "EXPIRED" || (latest.status === "PENDING" && new Date(latest.expiresAt).getTime() < Date.now()));
  const onboarding = useAction();

  if (status !== "Selected" && offers.length === 0) return null;

  return (
    <Panel title="Offer and hiring">
      {offers.map((offer) => (
        <div key={offer.offerLetterId} style={{ border: "1px solid var(--border)", background: "var(--bg-elevated)", borderRadius: 10, padding: 12, marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <strong style={{ fontSize: 13.5, color: "var(--text)" }}>{offer.designation}</strong>
            <Pill tone={statusTone(offer.status)}>{offer.status}</Pill>
          </div>
          <div style={{ fontSize: 12.5, color: "var(--text)", marginTop: 4, lineHeight: 1.6 }}>
            {money(offer.salaryAmount, offer.currency, offer.salaryPeriod)} · joining {fmtDate(offer.joiningDate)}<br />
            {offer.status === "PENDING" ? `Waiting for the answer until ${fmtDateTime(offer.expiresAt)}` : offer.respondedAt ? `Answered ${fmtDateTime(offer.respondedAt)}` : ""}
          </div>
        </div>
      ))}

      {latest?.status === "ACCEPTED" && (
        <div>
          <Notice kind="success">The offer was accepted. The employee account is created automatically.</Notice>
          <div style={{ marginTop: 8 }}>
            <Btn small kind="ghost" disabled={onboarding.busy}
              onClick={() => void onboarding.run(async () => {
                const result = await retryOnboarding(applicationId);
                onChanged();
                return result.created ? `Employee ${result.employee.employeeCode} created.` : `Employee ${result.employee.employeeCode} already exists.`;
              })}>
              Create the employee account again (only if it is missing)
            </Btn>
            <Messages error={onboarding.error} success={onboarding.success} />
          </div>
        </div>
      )}

      {(status === "Selected" || expired) && (
        <ConfirmHireForm applicationId={applicationId} reissue={!!expired} onChanged={onChanged} />
      )}
    </Panel>
  );
}

function ConfirmHireForm({
  applicationId, reissue, onChanged,
}: { applicationId: string; reissue: boolean; onChanged: () => void }) {
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState("Monthly");
  const [joining, setJoining] = useState("");
  const action = useAction();
  const today = new Date().toISOString().slice(0, 10);

  const submit = () => {
    if (!window.confirm(reissue ? "Issue a new offer letter?" : "Confirm the hire? An offer letter PDF will be emailed to the candidate.")) return;
    void action.run(async () => {
      const result = await confirmHire(applicationId, { salaryAmount: Number(amount), salaryPeriod: period, joiningDate: joining });
      onChanged();
      return `Offer sent${result.pdfAttached ? " with the PDF letter" : ""}. ${result.emailSent ? "The candidate was emailed." : "The email could not be sent; check the email log."}`;
    });
  };

  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text)", marginBottom: 8 }}>
        {reissue ? "The offer expired. Issue it again" : "Confirm hire and send the offer letter"}
      </div>
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
        <Field label="Pay amount">
          <input type="number" min={1} style={inputStyle} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="25000" />
        </Field>
        <Field label="Paid">
          <select style={inputStyle} value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="Monthly">Per month</option>
            <option value="Annual">Per year</option>
          </select>
        </Field>
      </div>
      <Field label="Joining date">
        <input type="date" min={today} style={inputStyle} value={joining} onChange={(e) => setJoining(e.target.value)} />
      </Field>
      <Btn kind="success" disabled={!amount || Number(amount) <= 0 || !joining || action.busy} onClick={submit}>
        {action.busy ? "Sending..." : reissue ? "Issue new offer" : "Confirm hire"}
      </Btn>
      <Messages error={action.error} success={action.success} />
    </div>
  );
}
