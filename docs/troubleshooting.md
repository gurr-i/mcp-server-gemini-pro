# Troubleshooting Guide

## Common Issues

### Connection Problems

1. Port Already in Use
```bash
Error: EADDRINUSE: address already in use :::3005
```
Solution:
- Check if another process is using port 3005
- Kill the existing process
- Change the port number

2. WebSocket Connection Failed
```
Error: Connection refused
```
Solution:
- Verify server is running
- Check firewall settings
- Confirm correct port

### API Issues

1. Invalid API Key
```
Error: Invalid API key provided
```
Solution:
- Check GEMINI_API_KEY environment variable
- Verify API key is valid
- Regenerate API key if needed

2. Rate Limiting
```
Error: Resource exhausted
```
Solution:
- Implement backoff strategy
- Check quota limits
- Upgrade API tier if needed

## Protocol Errors

1. Invalid Message Format
```json
Error: Parse error (-32700)
```
Solution:
- Check JSON syntax
- Verify message format
- Validate against schema

2. Method Not Found
```json
Error: Method not found (-32601)
```
Solution:
- Check method name
- Verify protocol version
- Update capabilities

## Debugging Steps

1. Enable Debug Mode
```bash
DEBUG=true npm start
```

2. Check Logs
```bash
tail -f debug.log
```

3. Monitor WebSocket Traffic
```bash
wscat -c ws://localhost:3005
```

## Getting Help

1. Check Documentation
- Review implementation notes
- Check protocol specification
- Read troubleshooting guide

2. Open Issues
- Search existing issues
- Provide error details
- Include reproduction steps

3. Community Support
- Join discussions
- Ask questions
- Share solutions
