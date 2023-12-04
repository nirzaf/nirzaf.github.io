---
title: "Performance Optimization Tricks and Tips With EF Core"
description: "Performance Optimization Tricks and Tips With Entity Framework Core With Net 7 With Real Time Examples"
heroImage: 'https://res.cloudinary.com/dcx7eongu/image/upload/c_crop,h_640,q_auto,w_1280/v1699812270/maxresdefault_dbjica.jpg'
pubDate: 'May 23 2023'
pin : true
categories: ["Entity Framework Core", "Performance Optimization"]
draft: false
---

Performance optimization is a critical aspect of developing robust and efficient applications, especially when working with a data access framework like Entity Framework Core (EF Core) in conjunction with the powerful .NET 7 platform. In this article, we will explore some performance optimization tricks and tips with EF Core and demonstrate their application in a real-time example using an accounting application scenario.

Before diving into the optimization techniques, let's briefly understand EF Core and its relevance in the .NET ecosystem. EF Core is a lightweight, extensible, and cross-platform version of Entity Framework, a popular Object-Relational Mapping (ORM) framework for .NET. It simplifies data access by providing a high-level API for querying and manipulating databases.

Now, let's consider an accounting application scenario where we have entities such as ```Account```, ```Transaction```, and ```User```. Each Account can have multiple Transaction records associated with it, and each Transaction is linked to a User. Our goal is to optimize the performance of data retrieval and manipulation operations in this scenario.

1. Use AsNoTracking():
#### One of the simplest yet effective techniques to improve performance is using the AsNoTracking() method. By default, EF Core tracks changes to entities in memory for change tracking purposes. However, if you only need to read data without modifying it, calling AsNoTracking() eliminates the overhead of change tracking. For example, when fetching a list of accounts, you can use:

```csharp
var accounts = context.Accounts.AsNoTracking().ToList();
```

2. Select Required Columns:
#### Fetching all columns of an entity when you only need a subset of them can impact performance, especially when dealing with large datasets. Instead, use the Select method to fetch only the required columns. For instance, if you need the account name and balance, you can write:

```csharp
var accounts = context.Accounts.Select(a => new { a.Name, a.Balance }).ToList();
```

3. Paging with Skip and Take:
#### When dealing with large datasets, fetching all records at once can lead to performance issues and increased memory consumption. Instead, use paging techniques with Skip and Take to fetch data in smaller chunks. This approach is particularly useful for scenarios where you need to display data in paginated views. For example:
    
```csharp
var pageSize = 10;
var pageNumber = 1;
var transactions = dbContext.Transactions
    .OrderByDescending(t => t.TransactionDate)
    .Skip((pageNumber - 1) * pageSize)
    .Take(pageSize)
    .ToList();
```

4. Eager Loading with Include:
#### By default, EF Core uses lazy loading, which means related entities are loaded on-demand when accessed. However, lazy loading can result in the N+1 query problem, where a separate query is executed for each entity, leading to performance degradation. To mitigate this, use eager loading with the Include method to fetch related entities upfront. For example:

```csharp
var accounts = dbContext.Accounts
    .Include(a => a.Transactions)
    .ToList();
```

5. Raw SQL Queries:
In certain scenarios, when complex queries or performance optimization is crucial, EF Core allows executing raw SQL queries. Raw SQL queries provide full control over the query structure and can be highly efficient. However, be cautious about SQL injection vulnerabilities and ensure proper parameterization. Here's an example:

```csharp
var accountId = 1;
var query = @"SELECT * FROM Transactions WHERE AccountId = {0}";
var transactions = dbContext.Transactions.FromSqlRaw(query, accountId).ToList();
```

These performance optimization techniques can significantly enhance the speed and efficiency of your accounting application. However, it's essential to measure and profile the performance improvements to ensure they are effective. Now, let's explore additional tips and best practices to optimize EF Core performance in the context of our accounting application scenario.

6. Indexing:
#### Indexing plays a crucial role in enhancing query performance. Analyze the queries executed against your database and identify frequently accessed columns. Then, create appropriate indexes to speed up the retrieval of data. In our scenario, you might consider indexing columns like ```AccountId``` in the ```Transactions``` table for faster filtering based on account.

7. Batch Updates and Inserts:
#### When dealing with bulk updates or inserts, EF Core can incur significant performance overhead due to individual database round-trips for each entity. To optimize this, EF Core provides the AddRange and UpdateRange methods to perform batch operations, reducing the number of round-trips. For example:

```csharp
var transactions = new List<Transaction> { /* list of transactions */ };

dbContext.Transactions.AddRange(transactions);
dbContext.SaveChanges();
```

8. Use Stored Procedures:
#### EF Core supports executing stored procedures using the FromSqlRaw method. Stored procedures can be highly efficient and can be used for complex queries or scenarios where performance is critical. For example:

```csharp
var accountId = 1;
var transactions = dbContext.Transactions
    .FromSqlRaw("EXECUTE dbo.GetTransactionsByAccount {0}", accountId)
    .ToList();
```

9. Use Compiled Queries:
#### EF Core allows compiling queries to improve performance. The compiled queries are cached and reused, eliminating the need for recompilation. For example:

```csharp
var query = dbContext.Transactions
    .Where(t => t.AccountId == 1)
    .OrderByDescending(t => t.TransactionDate)
    .Select(t => new { t.Id, t.Amount })
    .Compile();
```

10. Profiling and Monitoring:
#### It's essential to profile and monitor the performance of your application to identify bottlenecks and optimize them. EF Core provides a built-in logging mechanism that can be used to log queries and their execution time. You can also use third-party tools like MiniProfiler to profile and monitor your application.

<br>

In conclusion, optimizing performance in an accounting application scenario requires a combination of techniques at both the EF Core and database levels. By leveraging EF Core's features, such as AsNoTracking(), eager loading, and compiled queries, along with database-level optimizations like indexing and batch operations, you can significantly enhance the performance of your application. Remember to profile and monitor your application continuously to identify areas for improvement and ensure optimal performance throughout its lifecycle.

## References
- [Performance Optimization Tricks and Tips With Entity Framework Core With Net 7 With Real Time Examples](https://www.youtube.com/watch?v=TqC7USVOoxQ)

<iframe width="560" height="315" src="https://www.youtube.com/embed/TqC7USVOoxQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
