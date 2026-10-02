---
layout: ../../layouts/LegalLayout.astro
title: "Cumulus Rank and Reporting Privacy Policy | Cumulus Digital"
description: "How Cumulus Rank and Reporting handles Google Ads and other Google data: what we access, how we use, share, store and delete it."
eyebrow: "Legal"
heroTitle: "Cumulus Rank and Reporting <em class=\"glow\">privacy policy</em>."
---

*Last updated: 2 October 2026*

This policy explains what information Cumulus Digital Ltd collects through Cumulus Rank and Reporting, the internal web app our staff use at app.cumulusdigital.co.uk, why we collect it, how we use, share, store and protect it, how long we keep it, and how you can remove access or ask us to delete it. You can read [what the app does](/cumulus-rank-and-reporting/). This policy sits alongside our main [privacy policy](/privacy/), which covers our website and our other services.

## 1. Who we are

Cumulus Digital Ltd is the data controller for the information described in this policy. We process personal data in line with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.

Cumulus Digital Ltd

Company no. 09893216

2 Burwood Road, Hersham, Surrey KT12 4AG

Email: [info@cumulusdigital.co.uk](mailto:info@cumulusdigital.co.uk)

Cumulus Rank and Reporting is not a public product. It is used only by Cumulus Digital staff, each of whom signs in with their own username and password and sees only the clients assigned to them. It is not offered or sold to anyone else, and no one outside the agency can reach the Google Ads API through it.

## 2. Who this policy applies to

This policy applies to:

- our clients, the small UK businesses whose Google Ads, Google Analytics and Search Console accounts we manage or report on;
- anyone who authorises the app with their Google account; and
- Cumulus Digital staff who use the app.

## 3. Google permissions the app requests

When someone authorises the app with their Google account, Google shows a consent screen listing the permissions (scopes) the app asks for. The table below sets out each scope, what Google allows an app with that scope to do, and what Cumulus Rank and Reporting actually does with it.

| Scope | What Google allows | What the app actually does |
| --- | --- | --- |
| `https://www.googleapis.com/auth/adwords` (Google Ads API) | View and manage the Google Ads accounts the authorising user can access. | Reads account, campaign, ad group, keyword, search term, location, device, hourly, conversion, ad, asset and Local Services Ads data for the client accounts we manage. Once available, it will also make the small set of staff-approved changes described in section 5. It makes no other changes to Google Ads accounts. |
| `https://www.googleapis.com/auth/analytics.readonly` (Google Analytics) | View Google Analytics data. Read-only. | Reads website traffic, engagement and conversion figures for our clients' websites. It cannot change any Analytics settings or data. |
| `https://www.googleapis.com/auth/webmasters.readonly` (Search Console) | View Search Console data. Read-only. | Reads the searches, pages, clicks, impressions and positions for our clients' websites. It cannot change any Search Console settings or data. |

The app asks only for the scopes it needs for the features described in this policy. It does not request access to Gmail, Google Drive, Calendar, Contacts or any other Google service.

## 4. Information we collect

### Google Ads data

Through the Google Ads API, using the OAuth scope `https://www.googleapis.com/auth/adwords`, the app reads the following for the client accounts we manage:

- account details: account name, customer ID, currency and time zone;
- campaign, ad group and keyword settings and performance;
- the search terms that triggered our clients' ads;
- performance by location, device and hour of the day;
- conversion actions and conversions;
- ad and asset text and status; and
- cost, impressions and clicks.

This is mostly business performance data about our clients' advertising. Search terms are the words people typed into Google before seeing an ad. Occasionally a search term may itself contain a name or other personal detail typed by a searcher.

### Local Services Ads data

For clients who use Local Services Ads, the app reads each lead's date, type (call, message or booking), status, service category, and whether it was charged or credited, plus the account's totals for leads, cost, calls, rating and reviews. It does not read or store the name, phone number, email address or notes of the person who contacted the client.

### Google Analytics and Search Console data

With read-only access (the `analytics.readonly` and `webmasters.readonly` scopes), the app reads website traffic, engagement and conversion figures, and the searches, pages, clicks, impressions and positions for our clients' websites.

### Google sign-in tokens

When a member of staff connects the app to a Google service, Google issues OAuth tokens that let the app read data on a schedule without the person signing in again. The app stores these tokens so it can run its nightly data refresh. Google account passwords are never shared with the app.

### Staff account data

For each member of staff with an app account, we hold their username, a one-way bcrypt hash of their password, their role, and the clients assigned to them. When the account change features go live, the app will also record which member of staff approved each change, and when.

### Server and security logs

Our server and our hosting and security providers may record technical information when the app is used, such as IP address, browser type, pages requested and timestamps. We use this information only for security and troubleshooting.

### Cookies on the app

The app uses only cookies that are strictly necessary to keep staff signed in and the service secure. It does not use advertising or analytics cookies.

## 5. How we use the information

We use this data only to provide staff dashboards, account audits, monthly client reports and, once available, the staff-approved account changes described on the [app page](/cumulus-rank-and-reporting/). Managing and reporting on our clients' own Google Ads accounts is the service the app exists to provide. We do not use Google user data to serve, target or personalise advertising, for profiling, or for any other purpose.

In more detail:

- **Staff dashboards** show each client's spend, clicks, conversions, cost per conversion, website traffic and search visibility.
- **Account audits** flag wasted spend, missing negative keywords and other issues in a client's Google Ads account.
- **Monthly reports** are sent to each client about their own accounts only.
- **Account changes.** Today the app only reads data. We are adding a small set of changes that staff can make from the app: adding negative keywords; pausing keywords that spend without converting; creating new responsive search ads, which are always created paused; and adjusting a campaign budget by no more than 20% up or down per change. Each change is proposed by the app, approved individually by an agency admin, validated before it is applied, and logged with an undo. Nothing changes automatically or unattended. These changes are made only on the accounts of clients we manage, as part of the service they have engaged us to provide.

We use staff account data to sign staff in, control which clients each person can see, and keep a record of who approved each change. We use server and security logs only to keep the app secure and to investigate problems.

### What we never do with Google user data

- We do not sell it.
- We do not use it, or transfer it, to serve advertising, including retargeting, personalised or interest-based advertising. Managing and reporting on a client's own Google Ads account, which is the service we provide, is not a use of Google user data to serve, target or personalise advertising.
- We do not use it to build profiles of individuals, or to determine anyone's creditworthiness or for lending purposes.
- We do not use it to develop, improve or train generalised or non-personalised artificial intelligence or machine learning models.
- We do not allow data brokers, information resellers or any other third party to access it, except as described in section 7.
- We do not allow people to read it except where Google's Limited Use rules permit: where a client has asked or agreed for us to view specific data (for example, to review their account or prepare their report), where it is needed for security purposes such as investigating abuse, to comply with the law, or where the data has been aggregated and anonymised for the app's internal operations.

## 6. Our lawful basis under UK GDPR

Most of the data the app handles is business data about our clients' advertising and websites, not personal data. Where personal data is involved, we rely on:

- **Contract**, for processing needed to provide the account management and reporting services our clients engage us for;
- **Legitimate interests**, for running and securing the app, managing staff access, keeping audit records of account changes, and handling incidental personal data such as any personal detail that appears in a search term. Our interest is in delivering an accurate, secure service to our clients, and we keep the data we collect to the minimum needed for that; and
- **Legal obligation**, where we must keep or disclose information to comply with the law.

## 7. Who we share it with

We do not sell Google user data. We do not transfer it to third parties, except:

- in the reports we deliver to the client who owns the account;
- to Anthropic, which provides the AI service (Claude) the app uses to write audit recommendations and report summaries. The app sends Anthropic account performance figures and campaign, keyword and search term names. Anthropic processes them on our behalf to return that text and does not use them to train its models;
- to the infrastructure providers named in the table below, which are Hostinger (hosting and backups), Cloudflare (network security) and Google (the source of the data, through its APIs); and
- where the law requires us to.

### Service providers

We use the following providers to run our services. They process data on our behalf to provide their services to us.

| Provider | What it does | Where it may process data |
| --- | --- | --- |
| Hostinger | Hosts the app's virtual private server and PostgreSQL database, and takes automatic server backups. | Netherlands |
| Anthropic | Provides the Claude AI service used to write audit recommendations and report summaries. | May process data in the United States |
| Cloudflare | Provides network security for our websites and services. | Global network |
| Google | Provides the Google Ads, Google Analytics and Search Console APIs from which the data is read. Google's own handling of your data is covered by Google's privacy policy. | Global |

If we were ever involved in a merger, acquisition or sale of assets, we would transfer data only with notice and in line with this policy and Google's Limited Use requirements.

## 8. International transfers

The app's server and database are hosted in the Netherlands, which the UK recognises as providing adequate protection for personal data. Where data is transferred outside the UK and EEA, for example to Anthropic in the United States, we rely on appropriate safeguards recognised under UK law, such as the UK International Data Transfer Agreement or the UK Extension to the EU-US Data Privacy Framework, and you can ask us for details using the contact details in section 13.

## 9. How we store and protect it

- The data is stored in a PostgreSQL database on the app's own server, a virtual private server hosted by Hostinger in a data centre in the Netherlands.
- All connections to the app use HTTPS (TLS). Plain HTTP requests are redirected to HTTPS.
- Only Cumulus Digital staff with an app account can see the data, and each account sees only the clients assigned to it. Passwords are stored as one-way bcrypt hashes.
- The sign-in tokens for Google Analytics and Search Console are encrypted in the database. The Google Ads credentials are kept in the server's configuration, outside the database, and are never shown in the app.
- Agency tools can read the stored Google Ads data through a read-only interface that requires a secret key.

If we become aware of a personal data breach that affects you, we will tell you and, where required, the ICO, without undue delay.

## 10. How long we keep it

| Information | How long we keep it |
| --- | --- |
| Client Google data | While we manage the client's account. Deleted within 30 days of the end of our engagement. Deleting a client from the app permanently deletes all the Google Ads and Local Services data stored for them. |
| OAuth tokens | Until the connection is removed or access is revoked, then deleted. |
| Staff account data | Deleted when the staff member's app account is closed. |
| Account change log | Kept while we manage the client's account, as an audit record of changes made. |
| Server and security logs | Only as long as needed for security and troubleshooting. |
| Server backups | Our hosting provider's automatic server backups are kept for no more than four weeks, so deleted data is also gone from those backups within four weeks. |

## 11. How to remove access and ask for deletion

**Revoke the app's access to your Google account.** Anyone who has authorised the app with their Google account can revoke that access at [https://myaccount.google.com/permissions](https://myaccount.google.com/permissions). Once access is revoked, the app can no longer read data through that authorisation.

**Remove our access in Google Ads.** A client can stop the app reading their account at any time by removing our manager account link or our user access in Google Ads (Admin, then Access and security).

**Remove our access in Google Analytics or Search Console.** A client can remove our user access in Google Analytics (Admin, then Account access management or Property access management) or in Search Console (Settings, then Users and permissions).

**Ask us to delete data.** To ask us to delete data we hold, email [info@cumulusdigital.co.uk](mailto:info@cumulusdigital.co.uk). We will confirm once it is deleted, and in any event within one month. Removing access stops new data being collected but does not by itself delete data already stored, so please email us if you want that deleted too.

## 12. Your rights

Under UK GDPR you have the right to access the personal data we hold about you, to have it corrected or erased, to restrict or object to our use of it, and to data portability. To use any of these rights, email [info@cumulusdigital.co.uk](mailto:info@cumulusdigital.co.uk). We will respond within one month.

If you are unhappy with how we handle your data, please contact us first so we can try to put it right. You can also complain to the Information Commissioner's Office at [ico.org.uk](https://ico.org.uk/) or on 0303 123 1113.

## 13. Contact us

For any question about this policy or the app, contact:

Cumulus Digital Ltd, 2 Burwood Road, Hersham, Surrey KT12 4AG

Email: [info@cumulusdigital.co.uk](mailto:info@cumulusdigital.co.uk)

## 14. Children

The app is a business tool used only by Cumulus Digital staff to manage business accounts. It is not intended for children, and we do not knowingly collect personal data from children.

## 15. Google API Services User Data Policy

Cumulus Rank and Reporting's use and transfer of information received from Google APIs will adhere to the [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy), including the Limited Use requirements.

## 16. Changes to this policy

We will post any changes to this policy on this page and update the date at the top. If we make a significant change to how the app uses Google user data, such as requesting new permissions or using data for a new purpose, we will update this policy before the change takes effect.
