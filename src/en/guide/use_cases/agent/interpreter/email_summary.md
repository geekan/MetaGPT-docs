# Tool Usage: Email Summarization and Response

## Overview

Using Interpreter for viewing emails, quickly reviewing, and automatically replying to them.

## Example: Logging into Email, Viewing, and Summarizing Email Content

### Task

After logging into the email, display the sender and the body of the latest 5 emails, and summarize each email into one sentence.

### Code

```bash
python examples/mi/email_summary.py
```

### Execution Results

## Mechanism Explained

This scenario uses the `email_login_imap` tool to log into the email account for the email scenario. This tool utilizes the `imap_tools` library to authenticate and log in with the account and password.
