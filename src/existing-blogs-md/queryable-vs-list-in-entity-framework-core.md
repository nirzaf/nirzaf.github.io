---
title: "Queryable vs List in Entity Framework Core"
date: 2023-05-11T09:45:29Z
pin : true
categories: ["Entity Framework Core, C#, Queryable, List"]
draft: false


---

![Entity Framework Core](https://res.cloudinary.com/dcx7eongu/image/upload/v1683798533/maxresdefault_e75lub.jpg)

In Entity Framework Core, there are two main ways to retrieve data from a database: using a List or using a Queryable.

A List represents a collection of objects that have already been retrieved from the database. Once the data is in a List, any further operations on it are performed on the data in memory rather than on the database. This means that any filtering, sorting, or paging operations are performed on the client-side, which can be less efficient than performing them on the server-side.

On the other hand, a Queryable represents a query that has not yet been executed against the database. Any operations performed on a Queryable are translated into SQL and executed on the database server. This means that filtering, sorting, and paging operations are performed on the server-side, which can be more efficient.

Here are some examples of using a List and a Queryable:

Example 1: Using a List

```csharp
using (var context = new MyDbContext())
{
    var customers = context.Customers.ToList();

    // Perform further operations on customers in memory
}
```

In this example, the ToList() method retrieves all customers from the database and stores them in a List. Any further operations on the customers collection are performed in memory.

Example 2: Using a Queryable

```csharp
using (var context = new MyDbContext())
{
    var customers = context.Customers
        .Where(c => c.City == "London")
        .OrderBy(c => c.LastName)
        .Skip(10)
        .Take(5)
        .ToList();

    // Perform further operations on customers in memory
}
```
In this example, the Customers property is a Queryable that represents a query against the database. The Where, OrderBy, Skip, and Take methods are all performed on the Queryable and are translated into SQL and executed on the database server. The ToList method retrieves the final results from the database and stores them in a List. Any further operations on the customers collection are performed in memory.

In general, it is recommended to use a Queryable whenever possible, especially when dealing with large amounts of data. This allows the database server to perform filtering, sorting, and paging operations more efficiently, which can lead to better performance. However, there may be cases where using a List is more appropriate, such as when working with a small amount of data that can easily fit into memory.

In this article, we have learned about the differences between a List and a Queryable in Entity Framework Core. We have also learned when it is appropriate to use each one. I hope you have found this article useful.

