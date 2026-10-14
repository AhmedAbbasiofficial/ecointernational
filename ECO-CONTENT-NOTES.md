# ECO homepage content handover

The homepage design uses the approved white, signal red and light grey direction — graphite is not used anywhere. No images were created, generated or downloaded.

## Supplied information still needed

- Logo and product photographs for the main banner, category, three featured product slots and product-range section.
- Verified catalogue: model names, categories, rated power, specifications and any confirmed prices or purchase destinations.
- Sales and support telephone numbers, email and WhatsApp number. Unavailable contact fields remain hidden.
- A real form-submission endpoint. Current validation works, but the form explicitly reports that nothing has been sent; it does not store personal data.
- Genuine video, published articles and documented credentials. These three ordered sections are implemented but hidden until populated.
- Warranty terms and any support documentation links.

## Replacement points

Use `src/lib/eco-content.ts` for contacts, media URLs, products, articles, credentials and the enquiry endpoint. Product fixtures are visibly labelled catalogue previews and contain no invented specifications or prices. Upload supplied media through the project asset flow before inserting URLs.

Only the homepage was requested; navigation intentionally uses homepage anchors rather than creating secondary pages. Privacy, terms, checkout and sizing tools are not represented as available.

## Review checks

The fourteen section slots appear in order. Checked 360, 390, 430, 768, 1024 and 1440px widths; product detail dialog and enquiry selection; required-field validation; honest unsent form state; mobile menu and anchor navigation. No horizontal overflow or browser runtime errors were observed.
