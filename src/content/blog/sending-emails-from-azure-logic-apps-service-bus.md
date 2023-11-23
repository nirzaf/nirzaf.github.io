---
title: "Sending Emails From Azure Logic Apps Service Bus"
description: "Sending Emails From Azure Logic Apps Service Bus"
heroImage: 'https://res.cloudinary.com/dcx7eongu/image/upload/c_scale,h_1000,w_2000/v1700218906/logic-apps-data-integration_qpjv3k.png'
pubDate: 'Feb 30 2023'
pin : true
---

### Pre-requisites to follow along this tutorial

- Azure Subscription
- Email provider (Such as SendGrid, MailGun, Post-mark etc)

### What is Azure Logic Apps?

Azure Logic Apps is a cloud service that helps you schedule, automate, and orchestrate tasks, business processes, and workflows when you need to integrate apps, data, systems, and services across enterprises or organizations. Logic Apps simplifies how you design and build scalable solutions for app integration, data integration, system integration, enterprise application integration (EAI), and business-to-business (B2B) communication, whether in the cloud, on premises, or both.

### What is Azure Service Bus?

Azure Service Bus is a fully managed enterprise integration message broker. Service Bus is most commonly used to decouple applications and services from each other, and is a reliable and secure platform for asynchronous data and state transfer. Data is transferred between different applications and services using messages. A message is in binary format, which is a sequence of bytes. A message can be a simple string, a JSON object, or a binary object such as an image or video. A message can also contain custom application properties that are available for the application to use for message filtering.

### What is Email provider?

An email provider is a company that offers email hosting services. An email provider is different from an email client. An email client is a software application that you use to access email, such as Outlook, Gmail, or Thunderbird. An email provider is a company that offers email hosting services. An email provider is different from an email client. An email client is a software application that you use to access email, such as Outlook, Gmail, or Thunderbird.

Sending Emails through Azure Logic Apps become easier in most of the business requirements, specially triggered by Azure service bus, to learn more about Azure service bus please use the following [link](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-messaging-overview)

now let’s back to the point.

Azure Service bus messages can be queued based on topics and subscriptions, it will be categorized as following hierarchy

- Service bus namespace
- Topic
- Subscriptions

Steps to Follow

Create a Resource Group and Create a Logic App

Create a new workflow

in Designer View Your Trigger Should be as follows

``` 
When a message are available in a topic subscription
```
<center>

![](https://miro.medium.com/v2/resize:fit:472/format:webp/0*m-jHobhbQ4xEqDps.png)

</center>

Provide Your connection string of Service Bus with Topic and Subscription Name

Sample ARM template for your Logic App as follows

```
{
    "inputs": {
        "parameters": {
            "topicName": "your-topic-name-here",
            "subscriptionName": "your-subscription-name-here"
        },
        "serviceProviderConfiguration": {
            "connectionName": "serviceBus",
            "operationId": "receiveTopicMessages",
            "serviceProviderId": "/serviceProviders/serviceBus"
        }
    },
    "splitOn": "@triggerOutputs()?['body']"
}
```

Create an HTTP Action

Method: POST

URI: Your Email Providers Post API endpoint URI

Headers: Probably Your Authentication Token and Other Header Details Comes under header section

Body: You can extract your Message from Service in Body Section I will provide a sample ARM template below

```
{ 
    "inputs": { 
        "method": "POST", 
        "uri": "your-email-service-provider-API-endpoint", 
        "headers": { 
            "token": "your-authentication-token", 
            "content-type": "application/json" 
        }, 
        "body": { 
            "From": "@triggerOutputs()?['body']?['UserProperties/from']", 
            "HtmlBody": "@triggerOutputs()?['body']?['UserProperties/htmlBody']", 
            "ReplyTo": "@triggerOutputs()?['body']?['replyTo']", 
            "Subject": "@triggerOutputs()?['body']?['UserProperties/subject']", 
            "To": "@triggerOutputs()?['body']?['to']" 
        } 
    } 
}
```

that’s it, save the workflow, and your workflow will be triggered every time your Service received a message on specific subscription which you provided while you are creating the trigger.


