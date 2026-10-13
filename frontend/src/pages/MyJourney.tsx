import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getApplications } from "../api/applications";
import type { Application } from "../api/applications";
import { uploadApplicationResume } from "../api/resumes";
import {
  applyForJob,
  getAllJobs,
  confirmInterviewSlot,
  downloadOfferLetter,
  getInterviewRounds,
  getMyInvitations,
  getOffers,
  getStageHistory,
  respondToInvitation,
  respondToOffer,
  withdrawApplication,
} from "../api/pipeline";
import type { Invitation, InterviewRound, OfferLetter } from "../api/pipeline";
import {
  Btn, Empty, Field, Loading, Messages, Notice, PageShell, Panel, Pill, Timeline,
  fmtDate, fmtDateTime, inputStyle, money, statusTone, useAction, useLoad,
} from "../components/ui";

/** Opened from an email link: which invitation, offer or interview to show first. */
export type JourneyFocus = { kind: "invitation" | "offer" | "interview"; id: string };

const OPEN_STATUSES = ["Applied", "Screened", "Shortlisted", "Interviewed", "Selected"];
const AUTO_OPEN = ["Shortlisted", "Interviewed", "Selected", "Offered"];

/** A friendly sentence about what happens next, for each stage. */
function nextStep(status: string, hasScore: boolean): string {
  switch (status) {
    case "Applied": return hasScore ? "Your resume was received and is being screened." : "Upload your resume so our AI can review your profile.";
    case "Screened": return "A recruiter is reviewing your profile.";
    case "Shortlisted": return "You are shortlisted! Watch this page for interview time slots.";
    case "Interviewed": return "Your interview is done. We will tell you the result or the next round soon.";
    case "Selected": return "Congratulations, you cleared every round! Your offer letter is being prepared.";
    case "Offered": return "Your offer is ready. Please accept or decline it below.";
    case "Joined": return "Welcome to the team!";
    case "Rejected": return "Thank you for your interest. We will not move forward this time.";
    case "Withdrawn": return "This application is closed.";
    default: return "";
  }
}

export default function MyJourney({
  focus,
  onFocusUsed,
}: {
  focus: JourneyFocus | null;
  onFocusUsed: () => void;
}) {
  const { user } = useAuth();
  const candidateId = user?.candidateId ?? "";

  const { data, error, loading, reload } = useLoad(async () => {
    const [applications, jobs, invitations] = await Promise.all([
      getApplications(1, 50, "", candidateId),
      getAllJobs(),
      getMyInvitations(),
    ]);
    return { applications: applications.data, jobs, invitations: invitations.data };
  }, [candidateId]);

  const jobTitle = useMemo(() => {
    const map = new Map<string, string>();
    data?.jobs.forEach((job) => map.set(job.jobId, job.jobTitle));
    return (id: string) => map.get(id) ?? id;
  }, [data]);

  // After the email-link target has been shown once, forget it.
  useEffect(() => {
    if (focus && data) {
      const timer = window.setTimeout(onFocusUsed, 2500);
      return () => window.clearTimeout(timer);
    }
  }, [focus, data, onFocusUsed]);

  if (!candidateId) {
    return <PageShell><Notice kind="error">This page is for candidate accounts.</Notice></PageShell>;
  }
  if (loading && !data) return <Loading text="Loading your applications..." />;
  if (error && !data) return <PageShell><Notice kind="error">{error}</Notice></PageShell>;
  if (!data) return null;

  const activeJobIds = new Set(
    data.applications.filter((a) => OPEN_STATUSES.includes(a.status ?? "Applied") || a.status === "Offered").map((a) => a.jobId),
  );
  const openInvitations = data.invitations.filter(
    (i) => i.status === "PENDING" && new Date(i.expiresAt).getTime() > Date.now(),
  );

  return (
    <PageShell>
      <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.4px" }}>My Hiring Journey</h1>
      <p style={{ margin: "0 0 20px", color: "var(--text-secondary)", fontSize: 13.5 }}>
        Apply for jobs, pick interview times and answer offers, all in one place.
      </p>

      {openInvitations.length > 0 && (
        <Panel title={`Invitations for you (${openInvitations.length})`} style={{ marginBottom: 18 }}>
          <div style={{ display: "grid", gap: 10 }}>
            {openInvitations.map((invitation) => (
              <InvitationRow
                key={invitation.token}
                invitation={invitation}
                title={jobTitle(invitation.jobId)}
                highlighted={focus?.kind === "invitation" && focus.id === invitation.token}
                onDone={reload}
              />
            ))}
          </div>
        </Panel>
      )}

      <ApplyPanel
        jobs={data.jobs.filter((job) => !activeJobIds.has(job.jobId))}
        onApplied={reload}
      />

      <h2 style={{ margin: "24px 0 10px", fontSize: 16, fontWeight: 700, color: "var(--text)" }}>My applications</h2>
      {data.applications.length === 0 ? (
        <Panel><Empty>You have not applied for any job yet. Choose a job above to start.</Empty></Panel>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {data.applications.map((application) => (
            <ApplicationCard
              key={application.applicationId}
              application={application}
              title={jobTitle(application.jobId)}
              candidateId={candidateId}
              focus={focus}
              onChanged={reload}
            />
          ))}
        </div>
      )}
    </PageShell>
  );
}

/* ------------------------------ invitations ------------------------------ */

function InvitationRow({
  invitation, title, highlighted, onDone,
}: { invitation: Invitation; title: string; highlighted: boolean; onDone: () => void }) {
  const action = useAction();
  const answer = (accept: boolean) =>
    action.run(async () => {
      await respondToInvitation(invitation.token, accept);
      onDone();
      return accept ? "Invitation accepted. Your application has been created." : "Invitation declined.";
    });

  return (
    <div style={{
      border: `1px solid ${highlighted ? "var(--accent)" : "var(--border)"}`,
      background: highlighted ? "var(--accent-light)" : "var(--bg-elevated)",
      borderRadius: 10, padding: 14,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 700, color: "var(--text)" }}>{title}</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Valid until {fmtDate(invitation.expiresAt)}</div>
          {invitation.message && <div style={{ fontSize: 13, marginTop: 6, color: "var(--text)" }}>"{invitation.message}"</div>}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn small kind="success" disabled={action.busy} onClick={() => answer(true)}>Accept and apply</Btn>
          <Btn small kind="danger" disabled={action.busy} onClick={() => answer(false)}>Decline</Btn>
        </div>
      </div>
      <Messages error={action.error} success={action.success} />
    </div>
  );
}

/* --------------------------------- apply --------------------------------- */

function ApplyPanel({
  jobs, onApplied,
}: { jobs: Array<{ jobId: string; jobTitle: string; department: string | null }>; onApplied: () => void }) {
  const [jobId, setJobId] = useState("");
  const action = useAction();

  const apply = () =>
    action.run(async () => {
      await applyForJob(jobId);
      setJobId("");
      onApplied();
      return "Application sent! Upload your resume below to start the AI screening.";
    });

  return (
    <Panel title="Apply for a job">
      {jobs.length === 0 ? (
        <Empty>No open jobs to apply for right now.</Empty>
      ) : (
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 280px", marginBottom: -12 }}>
            <Field label="Job">
              <select value={jobId} onChange={(e) => setJobId(e.target.value)} style={inputStyle}>
                <option value="">Select a job...</option>
                {jobs.map((job) => (
                  <option key={job.jobId} value={job.jobId}>
                    {job.jobTitle}{job.department ? ` (${job.department})` : ""}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Btn disabled={!jobId || action.busy} onClick={apply}>{action.busy ? "Sending..." : "Apply"}</Btn>
        </div>
      )}
      <Messages error={action.error} success={action.success} />
    </Panel>
  );
}

/* ----------------------------- one application ---------------------------- */

function ApplicationCard({
  application, title, candidateId, focus, onChanged,
}: {
  application: Application;
  title: string;
  candidateId: string;
  focus: JourneyFocus | null;
  onChanged: () => void;
}) {
  const status = application.status ?? "Applied";
  const [open, setOpen] = useState(AUTO_OPEN.includes(status));
  const ref = useRef<HTMLDivElement>(null);

  const detail = useLoad(async () => {
    const [history, interviews, offers] = await Promise.all([
      getStageHistory(application.applicationId),
      getInterviewRounds(application.applicationId),
      getOffers(application.applicationId),
    ]);
    return { history, interviews, offers };
  }, [application.applicationId, status]);

  const holdsFocus = !!focus && !!detail.data && (
    (focus.kind === "interview" && detail.data.interviews.rounds.some((r) => r.roundId === focus.id)) ||
    (focus.kind === "offer" && detail.data.offers.offers.some((o) => o.token === focus.id))
  );

  useEffect(() => {
    if (holdsFocus) {
      setOpen(true);
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [holdsFocus]);

  const withdraw = useAction();
  const hasScore = application.matchScore !== null && application.matchScore !== undefined;

  const changed = () => {
    void detail.reload();
    onChanged();
  };

  return (
    <div
      ref={ref}
      style={{
        background: "var(--surface)",
        border: `1px solid ${holdsFocus ? "var(--accent)" : "var(--border)"}`,
        borderRadius: "var(--radius)",
        boxShadow: holdsFocus ? "0 0 0 3px var(--accent-glow)" : "var(--shadow-sm)",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", textAlign: "left", background: "transparent", border: "none", cursor: "pointer",
          padding: "14px 16px", display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", fontFamily: "inherit",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, color: "var(--text)", fontSize: 14.5 }}>{title}</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
            Applied {fmtDate(application.applicationDate)}
            {hasScore && <> · AI match {Math.round(Number(application.matchScore))}%</>}
          </div>
          <div style={{ fontSize: 12.5, color: "var(--text)", marginTop: 6 }}>{nextStep(status, hasScore)}</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Pill tone={statusTone(status)}>{status}</Pill>
          <span style={{ color: "var(--text-tertiary)" }}>{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {open && (
        <div style={{ borderTop: "1px solid var(--border)", padding: 16 }}>
          {detail.loading && !detail.data && <Loading />}
          {detail.error && <Notice kind="error">{detail.error}</Notice>}

          {detail.data && (
            <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
              <div>
                <h4 style={{ margin: "0 0 10px", fontSize: 13, color: "var(--text-secondary)" }}>PROGRESS</h4>
                <Timeline
                  events={detail.data.history.timeline.map((event) => ({
                    title: event.to,
                    detail: event.reason,
                    meta: fmtDateTime(event.at),
                  }))}
                />
              </div>

              <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
                {status === "Applied" && (
                  <ResumeUpload
                    candidateId={candidateId}
                    applicationId={application.applicationId}
                    hasScore={hasScore}
                    onUploaded={changed}
                  />
                )}

                {detail.data.interviews.rounds.length > 0 && (
                  <div>
                    <h4 style={{ margin: "0 0 8px", fontSize: 13, color: "var(--text-secondary)" }}>INTERVIEWS</h4>
                    <div style={{ display: "grid", gap: 10 }}>
                      {detail.data.interviews.rounds.map((round) => (
                        <RoundCard
                          key={round.roundId}
                          round={round}
                          highlighted={focus?.kind === "interview" && focus.id === round.roundId}
                          onChanged={changed}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {detail.data.offers.offers.length > 0 && (
                  <div>
                    <h4 style={{ margin: "0 0 8px", fontSize: 13, color: "var(--text-secondary)" }}>OFFER</h4>
                    <div style={{ display: "grid", gap: 10 }}>
                      {detail.data.offers.offers.map((offer) => (
                        <OfferCard
                          key={offer.offerLetterId}
                          offer={offer}
                          highlighted={focus?.kind === "offer" && focus.id === offer.token}
                          onChanged={changed}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {OPEN_STATUSES.includes(status) && (
                  <div>
                    <Btn
                      small kind="danger" disabled={withdraw.busy}
                      onClick={() => {
                        if (!window.confirm("Withdraw this application? This cannot be undone.")) return;
                        void withdraw.run(async () => {
                          await withdrawApplication(application.applicationId);
                          changed();
                          return "Application withdrawn.";
                        });
                      }}
                    >
                      Withdraw application
                    </Btn>
                    <Messages error={withdraw.error} success={withdraw.success} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ResumeUpload({
  candidateId, applicationId, hasScore, onUploaded,
}: { candidateId: string; applicationId: string; hasScore: boolean; onUploaded: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const action = useAction();

  return (
    <div style={{ background: "var(--bg-elevated)", border: "1px dashed var(--border)", borderRadius: 10, padding: 12 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>
        {hasScore ? "Upload a new resume" : "Upload your resume"}
      </div>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        style={{ fontSize: 12.5, color: "var(--text)", marginBottom: 8, maxWidth: "100%" }}
      />
      <div>
        <Btn
          small disabled={!file || action.busy}
          onClick={() => file && void action.run(async () => {
            await uploadApplicationResume(candidateId, applicationId, file);
            setFile(null);
            onUploaded();
            return "Resume uploaded. Our AI is reviewing it and your status will update shortly.";
          })}
        >
          {action.busy ? "Uploading and analysing..." : "Upload resume"}
        </Btn>
      </div>
      <Messages error={action.error} success={action.success} />
    </div>
  );
}

function RoundCard({
  round, highlighted, onChanged,
}: { round: InterviewRound; highlighted: boolean; onChanged: () => void }) {
  const [slot, setSlot] = useState("");
  const action = useAction();

  return (
    <div style={{
      border: `1px solid ${highlighted ? "var(--accent)" : "var(--border)"}`,
      background: highlighted ? "var(--accent-light)" : "var(--bg-elevated)",
      borderRadius: 10, padding: 12,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <div style={{ fontWeight: 700, color: "var(--text)", fontSize: 13.5 }}>
          Round {round.roundNumber}: {round.roundName}
        </div>
        <Pill tone={statusTone(round.status)}>{round.status === "PROPOSED" ? "CHOOSE A TIME" : round.status}</Pill>
      </div>

      {round.status === "PROPOSED" && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>
            Pick one time that suits you ({round.mode}):
          </div>
          {(round.proposedSlots ?? []).map((option) => (
            <label key={option} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, padding: "4px 0", color: "var(--text)", cursor: "pointer" }}>
              <input type="radio" name={`slot-${round.roundId}`} checked={slot === option} onChange={() => setSlot(option)} />
              {fmtDateTime(option)}
            </label>
          ))}
          <div style={{ marginTop: 8 }}>
            <Btn
              small disabled={!slot || action.busy}
              onClick={() => void action.run(async () => {
                await confirmInterviewSlot(round.roundId, slot);
                onChanged();
                return "Interview booked. A confirmation email is on its way.";
              })}
            >
              Confirm this time
            </Btn>
          </div>
        </div>
      )}

      {round.status === "SCHEDULED" && (
        <div style={{ marginTop: 8, fontSize: 13, color: "var(--text)" }}>
          <div><strong>{fmtDateTime(round.scheduledAt)}</strong> · {round.mode}</div>
          {round.meetingLink && (
            <div style={{ wordBreak: "break-all" }}>
              {/^https?:\/\//.test(round.meetingLink)
                ? <a href={round.meetingLink} target="_blank" rel="noreferrer" style={{ color: "var(--accent-text)" }}>{round.meetingLink}</a>
                : round.meetingLink}
            </div>
          )}
        </div>
      )}
      <Messages error={action.error} success={action.success} />
    </div>
  );
}

function OfferCard({
  offer, highlighted, onChanged,
}: { offer: OfferLetter; highlighted: boolean; onChanged: () => void }) {
  const action = useAction();
  const [employeeNote, setEmployeeNote] = useState<string | null>(null);

  const answer = (accept: boolean) => {
    if (!accept && !window.confirm("Decline this offer? Your application will be closed.")) return;
    void action.run(async () => {
      const result = await respondToOffer(offer.token, accept);
      if (accept && result.employee) {
        setEmployeeNote(
          `Your employee ID is ${result.employee.employeeCode}. ${result.welcomeEmailSent ? "We emailed you the steps to set your password." : "Please ask HR to resend your login details."}`,
        );
      }
      onChanged();
      return accept ? "Offer accepted. Welcome aboard!" : "Offer declined.";
    });
  };

  return (
    <div style={{
      border: `1px solid ${highlighted ? "var(--accent)" : "var(--border)"}`,
      background: highlighted ? "var(--accent-light)" : "var(--bg-elevated)",
      borderRadius: 10, padding: 12,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <div style={{ fontWeight: 700, color: "var(--text)", fontSize: 13.5 }}>{offer.designation}</div>
        <Pill tone={statusTone(offer.status)}>{offer.status}</Pill>
      </div>
      <div style={{ fontSize: 13, color: "var(--text)", marginTop: 6, lineHeight: 1.6 }}>
        {money(offer.salaryAmount, offer.currency, offer.salaryPeriod)}<br />
        Joining date: {fmtDate(offer.joiningDate)}<br />
        {offer.status === "PENDING" && <>Please answer before {fmtDateTime(offer.expiresAt)}</>}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
        {offer.status === "PENDING" && (
          <>
            <Btn small kind="success" disabled={action.busy} onClick={() => answer(true)}>Accept offer</Btn>
            <Btn small kind="danger" disabled={action.busy} onClick={() => answer(false)}>Decline</Btn>
          </>
        )}
        <Btn
          small kind="ghost"
          onClick={() => void action.run(async () => { await downloadOfferLetter(offer.offerLetterId); })}
        >
          Download offer letter (PDF)
        </Btn>
      </div>
      {employeeNote && <div style={{ marginTop: 10 }}><Notice kind="success">{employeeNote}</Notice></div>}
      <Messages error={action.error} success={action.success} />
    </div>
  );
}
