---
title: "Redis Caching With Asp.Net Core and Net 7"
description: "How to Use Redis Caching With Asp.Net Core and Net 7"
heroImage: 'https://res.cloudinary.com/dcx7eongu/image/upload/v1700217966/dotnetcore-redis-banner_tpjar7.webp'
pubDate: 'Sun Apr 30 2023'
pin : true
draft: false
---

![Redis](https://res.cloudinary.com/dcx7eongu/image/upload/v1682851876/redis_rwmq2o.png)

Caching is a crucial aspect of web application development. It can help reduce the load on the database, speed up application performance, and improve scalability. Redis is a popular in-memory data store that can be used for caching in ASP.NET Core applications. In this article, we will go through the steps involved in using Redis caching with ASP.NET Core and .NET 7.

#### Prerequisites

To follow along with this article, you should have the following:

- .NET 7 SDK installed on your machine
- Visual Studio 2022 or later or Visual Studio Code or JetBrains Rider
- Redis server installed locally or access to a remote Redis server

#### Creating a New ASP.NET Core Application
Let's start by creating a new ASP.NET Core application using the following steps:

1. Open Visual Studio and create a new ASP.NET Core Web Application project.
2. Choose "Web Application" as the project template and select "ASP.NET Core 7.0" as the target framework.
3. Choose a project name and location, and then click "Create".


#### Adding Redis Cache
To use Redis caching in your ASP.NET Core application, you need to add the Redis cache provider to your project. You can do this by adding the Microsoft.Extensions.Caching.Redis NuGet package to your project.

##### To add the Redis cache provider, follow these steps:
1. Open the NuGet Package Manager Console.
2. Run the following command in the Package Manager Console:
```
Install-Package Microsoft.Extensions.Caching.Redis
```
or you can add the package from the NuGet Package Manager UI.

Search for "Microsoft.Extensions.Caching.Redis" and click "Install".

#### Configuring Redis Cache
Once you have added the Redis cache provider to your project, you need to configure it in the Startup class. You can do this by adding the following code to the ConfigureServices method of the Startup class:
```
public void ConfigureServices(IServiceCollection services)
{
    // Add Redis cache
    services.AddStackExchangeRedisCache(options =>
    {
        options.Configuration = "localhost";
        options.InstanceName = "SampleInstance";
    });

    // Other service registrations...
}

public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    // Other middleware registrations...

    // Use Redis cache middleware
    app.UseResponseCaching();
}
```

In this code, we are adding the Redis cache provider to the IServiceCollection and configuring it with the Redis server address (localhost) and instance name (SampleInstance). We are also adding the Redis cache middleware to the application pipeline using the UseResponseCaching method.

#### Using Redis Cache
Now that Redis cache is configured, you can use it in your application to cache data. You can do this by injecting the IDistributedCache interface into your controllers or services and using it to read from or write to the cache.

##### To use Redis cache, follow these steps:

1. Inject IDistributedCache into your controller or service.
2. Use the SetStringAsync method to write data to the cache.
3. Use the GetStringAsync method to read data from the cache.

Here is an example of how to use Redis cache to cache a list of products:

```
private readonly IDistributedCache _cache;

public ProductService(IDistributedCache cache)
{
    _cache = cache;
}

public async Task<List<Product>> GetProductsAsync()
{
    var cacheKey = "ProductList";
    var cachedProducts = await _cache.GetStringAsync(cacheKey);

    if (cachedProducts != null)
    {
        return JsonSerializer.Deserialize<List<Product>>(cachedProducts);
    }

    var products = await _dbContext.Products.ToListAsync();
    var serializedProducts = JsonSerializer.Serialize(products);
    var cacheOptions = new DistributedCacheEntryOptions
    {
        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30)
    };

    await _cache.SetStringAsync(cacheKey, serializedProducts, cacheOptions);

    return products;
}
```

In this code, we are injecting IDistributedCache into our ProductService class and using it to cache a list of products. We are also using the SetStringAsync method to write the list of products to the cache and the GetStringAsync method to read the list of products from the cache.

#### Conclusion

In this article, we have learned how to use Redis caching with ASP.NET Core and .NET 7. We have also learned how to configure Redis cache and use it in our application to cache data. Redis caching can significantly improve the performance and scalability of your ASP.NET Core application. With Redis, you can easily cache frequently accessed data and reduce the load on your database, resulting in faster application response times and better scalability. I hope you have found this article useful. 

[def]: ../../images/redis.png