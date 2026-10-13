import { useState } from "react";
import { createRecruiterAccount, getAllRecruiters } from "../api/pipeline";
import {
  Btn, Field, Loading, Messages, Notice, PageShell, Panel, inputStyle, useAction, useLoad,
} from "../components/ui";

/** Admin only: give a recruiter a login. They activate it from an emailed one-time link. */
export default function StaffAccounts() {
  const recruiters = useLoad(getAllRecruiters);
  const [recruiterId, setRecruiterId] = useState("");
  const [email, setEmail] = useState("");
  const [created, setCreated] = useState<string[]>([]);
  const action = useAction();

  const submit = () =>
    action.run(async () => {
      const result = await createRecruiterAccount(email.trim(), Number(recruiterId));
      setCreated((list) => [result.user.email, ...list]);
      setEmail("");
      setRecruiterId("");
      return result.activationEmailSent
        ? `Account created. An activation link was emailed to ${result.user.email}.`
        : `Account created, but the activation email could not be sent. Check the email log in the Hiring Pipeline.`;
    });

  return (
    <PageShell>
      <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.4px" }}>Staff Accounts</h1>
      <p style={{ margin: "0 0 20px", color: "var(--text-secondary)", fontSize: 13.5 }}>
        Recruiters cannot sign themselves up. Create their login here, and they choose their own password from an emailed link.
      </p>

      <div style={{ maxWidth: 560, display: "grid", gap: 16 }}>
        <Panel title="Create a recruiter login">
          {recruiters.loading && !recruiters.data && <Loading />}
          {recruiters.error && <Notice kind="error">{recruiters.error}</Notice>}
          <Field label="Recruiter" hint="Pick the recruiter record this login belongs to">
            <select style={inputStyle} value={recruiterId} onChange={(e) => setRecruiterId(e.target.value)}>
              <option value="">Select a recruiter...</option>
              {recruiters.data?.map((r) => (
                <option key={r.recruiterId} value={r.recruiterId}>{r.recruiterName} (ID {r.recruiterId})</option>
              ))}
            </select>
          </Field>
          <Field label="Work email" hint="The activation link is sent here">
            <input type="email" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" />
          </Field>
          <Btn disabled={!recruiterId || !email.trim() || action.busy} onClick={submit}>
            {action.busy ? "Creating..." : "Create login and send activation link"}
          </Btn>
          <Messages error={action.error} success={action.success} />
        </Panel>

        {created.length > 0 && (
          <Panel title="Created in this session">
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--text)", lineHeight: 1.8 }}>
              {created.map((address) => <li key={address}>{address}</li>)}
            </ul>
          </Panel>
        )}
      </div>
    </PageShell>
  );
}
