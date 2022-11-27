React Times API
API for [React-Times](https://github.com/urlDev/mern-react-times)

### Scripts

- `npm run dev` starts dev with nodemon. A `config` folder with `dev.env` is needed, similar values with `.env.example`
- `npm run test` or `npm t` runs tests in watch mode
- `npm run start` runs server.

### Environment Variables

- **PORT**: Port to run the server, default is 3000 if not provided.
- **MONGODB_URL**: MongoDB connection URL. For production, it is the connection string via [application](https://www.mongodb.com/docs/atlas/driver-connection/) and for local, it is the string to [connect to MongoDB Compass](https://www.mongodb.com/docs/atlas/compass-connection/)
- **JWT_SECRET**: Unique string to hash the password. More information about that can be found in [JWT Docs](https://jwt.io/introduction).
- **SEND_GRID_API_KEY**: API key to be able to send emails when user registers and deletes account ([SendGrid API Docs](https://docs.sendgrid.com/for-developers/sending-email/api-getting-started)).
- **SEND_GRID_EMAIL**: Email address signed up to SendGrid to send emails to users.
- **SEND_GRID_REGISTER_TEMPLATE_ID** and **SEND_GRID_DELETE_TEMPLATE_ID**: Template ID for SendGrid to understand which template to use ([docs](https://docs.sendgrid.com/ui/sending-email/how-to-send-an-email-with-dynamic-templates)). Templates can be found under `/src/sendgrid`
- **API_URL**: API URL in production.
