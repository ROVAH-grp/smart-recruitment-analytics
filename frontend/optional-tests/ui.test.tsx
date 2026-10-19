import { execSync } from "node:child_process";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AuthProvider } from "./src/context/AuthContext";
import { login, register } from "./src/api/auth";
import MyJourney from "./src/pages/MyJourney";
import Pipeline from "./src/pages/Pipeline";
import StaffAccounts from "./src/pages/StaffAccounts";
import EmployeeDashboard from "./src/pages/EmployeeDashboard";
import ResetPassword from "./src/pages/ResetPassword";

const WAIT = { timeout: 15000 };

beforeAll(() => {
  window.confirm = () => true;
  Element.prototype.scrollIntoView = () => {};
});
afterEach(() => cleanup());

async function signIn(email: string, password: string) {
  const result = await login(email, password);
  localStorage.setItem("smart_recruitment_token", result.accessToken);
  localStorage.setItem("smart_recruitment_user", JSON.stringify(result.user));
}
async function signUp(email: string, candidateId: string) {
  await register({ email, password: "Cand1Pass", role: "CANDIDATE", candidateId });
  await signIn(email, "Cand1Pass");
}
const shell = (node: React.ReactNode) => render(<AuthProvider>{node}</AuthProvider>);

describe("candidate screens", () => {
  it("shows an application in progress with its timeline and booked interview", async () => {
    await signUp("four@x.com", "C4");
    shell(<MyJourney focus={null} onFocusUsed={() => {}} />);
    expect(await screen.findByText("My Hiring Journey", {}, WAIT)).toBeTruthy();
    expect(await screen.findByText("Data Analyst Intern", {}, WAIT)).toBeTruthy();
    expect(await screen.findByText(/Round 1: Technical/, {}, WAIT)).toBeTruthy();
    expect(screen.getAllByText("SCHEDULED").length).toBeGreaterThan(0);
    expect(screen.getByText(/You are shortlisted/)).toBeTruthy();
    expect(screen.queryByText(/Technical \d/)).toBeNull(); // no scores for candidates
  });

  it("lets a candidate accept an offer and tells them their employee ID", async () => {
    await signUp("five@x.com", "C5");
    const user = userEvent.setup();
    shell(<MyJourney focus={null} onFocusUsed={() => {}} />);
    const accept = await screen.findByRole("button", { name: "Accept offer" }, WAIT);
    await user.click(accept);
    expect(await screen.findByText("Offer accepted. Welcome aboard!", {}, WAIT)).toBeTruthy();
    expect(await screen.findByText(/Your employee ID is NXR-\d{4}-\d{4}/, {}, WAIT)).toBeTruthy();
  });

  it("lets a candidate accept an invitation, which creates the application", async () => {
    await signUp("one@x.com", "C1");
    const user = userEvent.setup();
    shell(<MyJourney focus={null} onFocusUsed={() => {}} />);
    expect(await screen.findByText(/Invitations for you \(1\)/, {}, WAIT)).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Accept and apply" }));
    expect(await screen.findByText(/Invitation accepted/, {}, WAIT)).toBeTruthy();
    // the new application appears in the list, asking for a resume, and the invitation is gone
    expect(await screen.findByText(/Upload your resume so our AI can review/, {}, WAIT)).toBeTruthy();
    await waitFor(() => expect(screen.queryByText(/Invitations for you/)).toBeNull(), WAIT);
  });

  it("opens the right offer when the candidate arrives from an email link", async () => {
    await signIn("five@x.com", "Cand1Pass");
    const scrolled = vi.fn();
    Element.prototype.scrollIntoView = scrolled;
    shell(<MyJourney focus={{ kind: "offer", id: "t1" }} onFocusUsed={() => {}} />);
    expect(await screen.findByText("ACCEPTED", {}, WAIT)).toBeTruthy(); // the offer card is open
    await waitFor(() => expect(scrolled).toHaveBeenCalled(), WAIT); // and was scrolled into view
  });
});

describe("recruiter control room", () => {
  it("shows the overview, opens an application and runs the automation", async () => {
    await signIn("boss@nexoraa.com", "Admin1Secret");
    const user = userEvent.setup();
    shell(<Pipeline />);

    expect(await screen.findByText("Hiring funnel", {}, WAIT)).toBeTruthy();
    expect(screen.getByText("Needs attention")).toBeTruthy();
    expect(await screen.findByText("Pipeline Six", {}, WAIT)).toBeTruthy(); // stuck 20 days in Applied

    await user.click(screen.getByRole("tab", { name: "Applications" }));
    const row = (await screen.findByText("Pipeline Four", {}, WAIT)).closest("tr") as HTMLElement;
    await user.click(within(row).getByRole("button", { name: "Manage" }));

    const dialog = await screen.findByRole("dialog", {}, WAIT);
    expect(await within(dialog).findByText("What happened so far", {}, WAIT)).toBeTruthy();
    expect(within(dialog).getByText(/No report yet/)).toBeTruthy();
    expect(within(dialog).getByText("Decision")).toBeTruthy();
    expect(within(dialog).getByText(/Interviews/)).toBeTruthy();
    await user.click(within(dialog).getByRole("button", { name: "Close" }));

    await user.click(screen.getByRole("tab", { name: "Activity" }));
    expect(await screen.findByText(/Every change to an application/, {}, WAIT)).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Emails sent" }));
    expect(await screen.findByText("Every automatic email", {}, WAIT)).toBeTruthy();

    await user.click(screen.getByRole("tab", { name: "Automation" }));
    await user.click(await screen.findByRole("button", { name: "Run now" }, WAIT));
    expect(await screen.findByText("The automation ran. The results are shown below.", {}, WAIT)).toBeTruthy();
    expect(screen.getByText("Offers expired")).toBeTruthy();
  });

  it("sends an invitation and lists new hires", async () => {
    await signIn("boss@nexoraa.com", "Admin1Secret");
    const user = userEvent.setup();
    shell(<Pipeline />);

    await user.click(await screen.findByRole("tab", { name: "Invitations" }, WAIT));
    await user.type(await screen.findByPlaceholderText("C0001", {}, WAIT), "C3");
    const jobSelect = screen.getAllByRole("combobox")[0];
    await waitFor(() => expect(within(jobSelect).getAllByRole("option").length).toBeGreaterThan(1), WAIT);
    await user.selectOptions(jobSelect, "J1");
    await user.click(screen.getByRole("button", { name: "Send invitation" }));
    expect(await screen.findByText(/Invitation sent/, {}, WAIT)).toBeTruthy();

    await user.click(screen.getByRole("tab", { name: "New hires" }));
    expect(await screen.findByText("Pipeline Five", {}, WAIT)).toBeTruthy();
  });

  it("lets an admin create a recruiter login", async () => {
    await signIn("boss@nexoraa.com", "Admin1Secret");
    const user = userEvent.setup();
    shell(<StaffAccounts />);
    const select = await screen.findByRole("combobox", {}, WAIT);
    await waitFor(() => expect(within(select).getAllByRole("option").length).toBeGreaterThan(1), WAIT);
    await user.selectOptions(select, "1");
    await user.type(screen.getByPlaceholderText("name@company.com"), "anita@x.com");
    await user.click(screen.getByRole("button", { name: /Create login/ }));
    expect(await screen.findByText(/Account created/, {}, WAIT)).toBeTruthy();
    expect(await screen.findByText("anita@x.com", {}, WAIT)).toBeTruthy();
  });
});

describe("employee dashboard", () => {
  it("shows the checklist and lets the employee tick tasks and see progress", async () => {
    const email = execSync(
      `mysql -N -e "SELECT work_email FROM employees WHERE full_name='Pipeline Five'" smart_recruitment_f`,
    ).toString().trim();
    expect(email).toContain("@nexoraa.com");
    execSync(`cd /home/claude/ws && node -e "const b=require('bcrypt');const m=require('mysql2/promise');(async()=>{const c=await m.createConnection({host:'127.0.0.1',user:'app',password:'apppass',database:'smart_recruitment_f'});await c.execute('UPDATE users SET password_hash=? WHERE email=?',[await b.hash('Temp1Pass12',10),'${email}']);await c.end();})()"`);
    await signIn(email, "Temp1Pass12");
    const user = userEvent.setup();
    shell(<EmployeeDashboard />);

    expect(await screen.findByText(/Welcome, Pipeline!/, {}, WAIT)).toBeTruthy();
    expect(screen.getByText(/temporary password/)).toBeTruthy();
    expect(screen.getByText("Onboarding checklist")).toBeTruthy();
    expect(screen.getByText("Upload ID proof")).toBeTruthy();

    await user.click(screen.getAllByRole("button", { name: "Mark done" })[0]);
    expect(await screen.findByText("20%", {}, WAIT)).toBeTruthy();
    expect(screen.getByText("✓ Upload ID proof")).toBeTruthy();

    await user.type(screen.getAllByLabelText(/Current password/)[0], "Temp1Pass12");
    await user.type(screen.getByLabelText(/^New password/), "weakpass");
    expect(await screen.findByText(/at least one letter and one number/)).toBeTruthy();
  });
});

describe("account links from emails", () => {
  it("shows the activation screen with the token asked for when it is not in the link", async () => {
    render(<ResetPassword token={null} mode="activate" onBackToLogin={() => {}} />);
    expect(screen.getByText("Activate Your Account")).toBeTruthy();
    expect(screen.getByText("Token from your email")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Activate Account" })).toBeTruthy();
  });

  it("hides the token box when the link already carried it", async () => {
    render(<ResetPassword token="abc" onBackToLogin={() => {}} />);
    expect(screen.getByText("Reset Password", { selector: "h1" })).toBeTruthy();
    expect(screen.queryByText("Token from your email")).toBeNull();
  });
});
