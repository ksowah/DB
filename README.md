# AI-Powered Database Schema Generator  
https://www.loom.com/share/00e54b19fbfd4e879e809ca1cb2c2a80?sid=b6c3c077-b66c-4cab-9258-05945dd05253


![Tech Stack](https://img.shields.io/badge/stack-React%20%7C%20GraphQL%20%7C%20MongoDB%20%7C%20OpenAI-blue)  

An intelligent database schema design tool that uses OpenAI to guide users through creating optimized MongoDB/NoSQL schemas through conversational interactions.  

## Features  
- 🧠 OpenAI-guided schema design process  
- 💬 Interactive chat interface with message history  
- 🗃️ Automatic MongoDB schema generation  
- 🔄 Real-time schema visualization  
- 📁 Project versioning and persistence  
- 📱 Mobile-responsive UI  

## Technology Stack  
**Frontend**  
- Next.js 14 (App Router)  
- Apollo Client (GraphQL management)  
- Mantine UI component library  
- Zod for schema validation  

**Backend**  
- GraphQL API with Apollo Server  
- Mongoose ODM for MongoDB  
- OpenAI GPT-4 API integration  

**Database**  
- MongoDB Atlas with optimized indexing  

## Implementation Details  

### AI Integration Architecture  
```typescript
// Core AI interaction flow
const generateSchema = async (conversationHistory: Message[]) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a MongoDB expert. Guide the user through schema design by asking 1 question at a time. 
        Final output must be JSON with this structure:
        {
          "schema": {
            "collection": {
              "fields": {"name": "type"},
              "indexes": ["field"]
            }
          }
        }`
      },
      ...conversationHistory
    ],
    temperature: 0.7,
    max_tokens: 500
  });

  const response = completion.choices[0].message.content;
  const schema = extractJSON(response); 
  return schema;
};
```

# Environment Setup Guide

## Prerequisites
- **Node.js v18** or higher ([Download](https://nodejs.org/))
- **MongoDB Atlas** account ([Sign Up](https://www.mongodb.com/atlas))
- **OpenAI API Key** ([Get Key](https://platform.openai.com/api-keys))
- Git (for cloning repository)

---

## Installation Steps

### 1. Clone Repository

## Frontend
```bash
git clone https://github.com/ksowah/Schema-Generator-Frontend.git
cd Schema-Generator-Frontend

npm install
```

## Backend
```bash
git clone https://github.com/ksowah/DB.git
cd DB

npm install
```

## Configure Environment Variables For Frontend
```bash
NEXT_PUBLIC_APOLLO_URI=
NEXT_PUBLIC_DOMAIN=

## Configure Environment Variables For Backend
```bash
DEEPSEEK_KEY=
MONGODB_URI=
MONGODB_DATABASE=