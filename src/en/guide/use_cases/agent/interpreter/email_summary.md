# Tool Usage: Email Summarization and Response

## Overview

Using `DataInterpreter` for viewing emails, quickly reviewing, and automatically replying to them.

## Example: Logging into Email, Viewing, and Summarizing Email Content

### Task

After logging into the email, display the sender and the body of the latest 5 emails, and summarize each email into one sentence.

### Code

[examples/di/email_summary.py](https://github.com/geekan/MetaGPT/blob/main/examples/di/email_summary.py)

```bash
python examples/di/email_summary.py
```

### Execution Results

<br>
<img src="../../../../../public/image/guide/use_cases/interpreter/email.jpeg">

## Mechanism Explained

This scenario uses the `email_login_imap` tool to log into the email account for the email scenario. This tool utilizes the `imap_tools` library to authenticate and log in with the account and password.
