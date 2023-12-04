---
title: "ASP.NET Core .NET 8 Preview 4 New Features and Updates"
description: "ASP.NET Core .NET 8 Preview 4 New Features and Updates"
heroImage: 'https://res.cloudinary.com/dcx7eongu/image/upload/c_crop,g_face,h_512,w_1024/v1699812067/c4899045-7f7e-4ca0-bc8f-e0645009de6d_plsvf0.jpg'
pubDate: 'Jun 05 2023'
draft: false
tags: ["ASP.NET Core", ".NET 8", "Preview 4"]
categories: ["ASP.NET Core"]
---

The latest news about ASP.NET Core has been released, and it brings exciting new features and updates aimed at enhancing the development experience. The ASP.NET Core development team has been working hard to introduce these features in the latest Preview. Let's delve into the details of the new features and updates.

1. Blazor:
   - Streamlining SSR with Blazor Components: With the release of .NET 8, it is now possible to stream content updates to client-side using Server-Side Rendering (SSR). This allows for faster-loading server-side Blazor pages. By adding a script tag and using conditional rendering, you can optimize the page loading experience.

```html

    @if (isServerSide)
    {
         <script src="_framework/blazor.server.js"></script>
    }
    else
    {
         <script src="_framework/blazor.webassembly.js"></script>
    }
    
```

   - Mastering Form Posts in Blazor SSR: Dealing with form posts in SSR has become easier. You can now create a model binding context using the CascadingModelBinder component, and define a form using the EditForm component. This simplifies form submission handling in Blazor SSR.
    
    <CascadingModelBinder>
        <EditForm Model="@model" OnValidSubmit="@HandleValidSubmit">
            <InputText @bind-Value="@model.Name" />
            <button type="submit">Submit</button>
        </EditForm>
    </CascadingModelBinder>
    ```

   - Named Element Routing in Blazor: Blazor now supports client-side routing to specific HTML elements using URL fragments. By adding an id attribute to the desired element, Blazor will automatically scroll to it when the URL fragment matches its identifier. This feature improves navigation and enhances the user experience.
    
    ```html
     <h1 id="myHeader">My Header</h1>
     <a href="#myHeader">Go to my header</a>
     ```

2. Bye-Bye .dll Woes: Webcil Packaging for Blazor WebAssembly Apps: Webcil packaging eliminates issues related to blocked .dll file downloads or usage in Blazor WebAssembly apps. By enabling the WasmEnableWebcil property in the project file, native Windows execution content from .NET assemblies is removed, resolving these frustrations.

3. Minimal APIs Now Support Form Binding: In minimal APIs, form binding for specific types such as IFormCollection, IFormFile, and IFormFileCollection no longer requires the FromForm attribute. This simplifies the code and improves the form binding process.

Check the below code snippet for form binding:

```csharp
   app.MapPost("/upload", (IFormFile file) =>
   {
       // Do something with the file
   });
```

4. Boost Your API Development with .http Files: New API projects now come with an included .http file. This file simplifies testing your app's endpoints using the Visual Studio HTTP editor. You can define your API host address and easily test various request examples.


```http
   GET https://localhost:5001/weatherforecast
```

5. Native AOT: Native Ahead-of-Time (AOT) compilation is now available, allowing for improved performance and reduced startup time of applications.

6. Streamlined Logging and Exception Handling in Compile-time Minimal APIs: By enabling the Request Delegate Generator (RDG), you can automate logging and exception handling in compile-time minimal APIs. This simplifies development and enhances error handling.


7. ASP.NET Core Metrics: The introduction of System.Diagnostics.Metrics brings improvements to ASP.NET Core metrics. New measurement types such as counters, gauges, and histograms provide more flexibility. Enhanced multi-dimensional value reporting allows for deeper performance analysis, and compatibility with cloud-native ecosystems ensures seamless integration with OpenTelemetry and other platforms.

With these new features and updates, ASP.NET Core .NET 8 Preview 4 transforms the web application development process, ensuring a smooth and pleasant experience. From Blazor enhancements to minimal APIs, Native AOT, and improved metrics, developers have the tools to create performant and scalable applications. Embrace these features and optimize your way to success!
