# iframe Embedding Security and Compatibility Guidance

When embedding the chatbox via an iframe in WordPress or other platforms, consider the following best practices to ensure security, privacy, and compatibility:

## Recommended iframe Attributes

- `allow="microphone; clipboard-write"`  
  Enables microphone access and clipboard write permissions for the embedded chatbox.

- `sandbox="allow-scripts allow-same-origin allow-popups"`  
  Restricts iframe capabilities to only necessary permissions, improving security.

- `style="width: 400px; height: 600px; border: none;"`  
  Adjust size and appearance as needed.

## CORS Configuration

- Ensure your S3 bucket and CloudFront distribution have CORS policies allowing the embedding domain to access resources.

- Configure HTTP headers to allow cross-origin requests for scripts, styles, and assets.

## HTTPS Usage

- Serve your S3 content over HTTPS to avoid mixed content issues when embedding in HTTPS WordPress sites.

- Use CloudFront with SSL certificates for secure delivery.

## Cookie and Session Management

- Configure cookies with `SameSite=None; Secure` attributes if your chatbox uses cookies for session management.

- Test cookie behavior in embedded context to avoid authentication or state issues.

## Microphone Permissions

- Inform users that microphone access is requested via the iframe.

- Ensure your site has a valid SSL certificate, as microphone access requires HTTPS.

## Troubleshooting

- Use browser developer tools to inspect iframe network requests and console logs.

- Check for CORS errors or permission denials.

- Adjust CloudFront invalidation and cache settings to ensure latest assets are served.

---

This guidance helps maintain a secure and functional embedded chatbox experience.
