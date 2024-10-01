---
title: "Microsoft Blazor Web API with JWT Authentication"
date: 2022-10-23T09:54:59+05:30
draft: true
pin : false
tags: ["blazor", "jwt", "dotnetcore"]
---

!["NET-Core"](https://i.ibb.co/0FgXTx0/1-zaw5-Gv-QLr-Bs-EED68-Ce-M9ew.png)

<p>I would like to share a guide on how to implement a JWT Authentication system into a Dotnet Core 2 Web API project that uses Microsofts new Blazor, but this same guide can be used for regular Asp.Net core 2 Web API’s.</p>
<p>If you have not heard of Blazor I encourage you to take a look at Blazor . In a nutshell it allows you to write client side and server side code using just C#, take a minute to let that sink in… This means no JavaScript needed to write UI, well… there are ways to still use JavaScript using the Javascript interop if there are no other library’s available in C#.</p>
<p>I hope you find this guide useful and I will post the source code onto <a href="https://github.com/nirzaf/DotnetCoreJwtAuthentication.git">GitHub.</a></p>

##### Assumptions:

<ul>
<li>You have Visual Studio (any edition) v15.7 or later. If you are using anything else then at least have knowledge of the dotnet command line.</li>
<li>you know how to use the Nuget package manager</li>
<li>You know C# and how to build a basic web project.</li>
<li>You know what JWT tokens are and why you have chosen to use it :)</li>
</ul>

###### let’s begin.

<p>First off, follow this link <a href="https://blazor.net/docs/get-started.html">Blazor getting started docs</a> to go through the setup instructions for getting the Blazor templates and newest Dotnet Core 2 SDK.</p>
<p>Create a project with Blazor (Asp.NET Core hosted) and give it any name you wish. At the time of writing this guide you can only choose “No Authentication” on the template. I am using Blazor version 0.5</p>
<p>Next step is to install a few Nuget packages into our .Server project:</p>

<li>Microsoft.AspNetCore.Authentication.JwtBearer</li>

<p>Your .Server .csproj file should look similar to this</p>

{{< gist nirzaf 6a3a6901f5c2256ee0ab2a9e657cf039 >}}
<p>Next we need to setup our Startup.cs file. First we need to Include the IConfiguration service so that we can use .appsettings.json file which we will look at in the next step.
</p>

{{< gist nirzaf 960fc1ebd20938fb065595404d091399 >}}

<p>Now create a “appsettings.json” file in the root of your .Server project and open it. Add in the “Jwt” json to setup the token. Basically we are adding in a private key “Key” then adding in the Issuer which is the .Server project, then we add in the Audience which will be our .Client project, the Blazor project setup means these are both the same, the expiry time is how long before the token can no longer be used. Don’t worry about the “ConnectionStrings” for now as this is for setting up a database.</p>

<img src="https://i.ibb.co/mGT3N5K/1-9-UDTBKl-IDi-Erb-FIl4nsv-Q.png" alt="1-9-UDTBKl-IDi-Erb-FIl4nsv-Q" border="0">
<div style="text-align:center"> appsettings.json</div>

<p> Next we go back to the Startup.cs file. Now we will tell the ConfigureService to allow JwtBearer Authentication which can later use in the controllers as [Authorize]. There is quite a number of options on the TokenValidationParameters and I won’t get into all of them but they are quite self explanatory. The Configuration[“”] part is what talks to the appsettings.json file and looks for the key/value pairs</p>

<img src="https://i.ibb.co/RQLFmkR/1-fa4-BU-RByh6h-Eiv0-Mz-Gyo-Q.png" alt="1-fa4-BU-RByh6h-Eiv0-Mz-Gyo-Q" border="0">
<div style="text-align:center" class="mute">Startup.cs in ConfigureServices method</div>

<img src="https://i.ibb.co/jb9cTqd/1-sp-UDzoa-DBSSXE13-U3g-P0g.png" alt="1-sp-UDzoa-DBSSXE13-U3g-P0g" border="0">
<div style="text-align:center" class="mute">Startup.cs</div>

<p>Now we are getting to the good stuff! Launch your app and using postman or just navigating through the browser, use “ http://localhost:57778/api/SampleData/WeatherForecasts” and see how the data is showing in a GET request. Now stop the app and go to the SampleDataController in the .Server project, Add a [Authorize] attribute to your public class SampleDataController, you will need to add the “using Microsoft.AspNetCore.Authorization” as well.</p>

<img src="https://i.ibb.co/3RCp97H/1-M2ori-HRa6-Nz2-H5v4-Lr-XRsg.png" alt="1-M2ori-HRa6-Nz2-H5v4-Lr-XRsg" border="0">
<div style="text-align:center" class="mute">SampleDataController.cs</div>

<p>Now start the app again and repeat the process for getting the data. You should now receive a 401 Unauthorized, if you did then wahey, your controller is now secure :) alternatively you can add the [Authorize] onto the methods instead of you want to just use it on a specific method.</p>
<p>Next we need to create a way of building a token for the client to receive. First I will create an interface called IJwtTokenService which will have 1 method</p>

##### string BuildToken(string email);

{{< figure src="https://i.ibb.co/mcZXLcT/1-CJZi0-P9-Thno-Zh-Mp-Xs-Il-Ba-Q.png" title="IJwtTokenService.cs" >}}

<p>Then I am creating a new class called JwtTokenService.cs in root/Service folder of .Server project (I chose to call it service folder, call it anything you want).</p>

{{< figure src="https://i.ibb.co/xgxppdQ/1-BULKgm-JAO4c5u-Wpf-YTLqgg.png" >}}

<p>
First we create a new IConfiguration dependency injection in the constructor which will allow us to use the appsettings.json.
Then we create a BuildToken method to create a token which will eventually be sent back to the client.
</p>

{{< figure src="https://i.ibb.co/PtJWX53/1-z-e8-Qckgmq-K6-HPUoq-Lsg3-Q.png" title="JwtTokenService.cs" >}}

<p>The next part is easy to forget as I almost always do! We need to add the service in the Startup.cs
</p>
{{< figure src="https://i.ibb.co/cL2t2f8/1-rf-M-Ddtr9w7-H2b-7-Cm-W8-Qg.png" 
title="Startup.cs">}}

<p>Before we start building the controller for handling clients wanting tokens, lets build a TokenViewModel so the user can send in their Email address or whatever you will want to authenticate them (usually email and password), I will keep mine simple for the purpose of this tutorial.</p>

{{< figure src="https://i.ibb.co/2t3k373/1-5-d6g-A0jv-VAU1vl-Evc8-Bd-A.png"
 title="TokenViewModel.cs" >}}
<p>Next we will build the token controller or account controller depending on how you are building your app. For this I will call it TokenController and it will be an empty API controller. We will Inject the token service and create a POST method that we can use to send the client a token</p>

{{< figure src="https://i.ibb.co/n09hmsQ/1-cpt-Rp-Osb8-I8d8-LXYHl6-RPA.png" title="TokenController.cs">}}
<p>Now start the app and call this controller with Postman or with your program of choice. “ http://localhost:57778/api/Token” and enter the body email and send.
You will then recieve your token</p>

{{< figure src="https://i.ibb.co/xmwqmYr/1-Buo-SAr2r-Bb-S6-WIAic2-DCn-A.png" >}}

<p>You can then copy and paste the token string into the call to http://localhost:57778/api/SampleData/WeatherForecasts and add the bearer token</p>

{{< figure src="https://miro.medium.com/max/1610/1*NqRmwosJgYMiwpHxvxByyg.png">}}
<p>When you send the request you will receive a Ok 200 response and you will receive the data from the controller, Hurrah!
</p>

{{< figure src="https://miro.medium.com/max/1595/1*jpn65Ia3Nsm0CFAAg4woJg.png" >}}
<p>Congratulations, you have successfully implemented JWT Authentication to your Asp.Net core 2 application.</p>
<p>Now I will be showing you how to implement a simple login page with Blazor and get it to send api calls to the Server we created in Part 1 and retrieve a authentication token. We will be working in the “Client” solution of the project.</p>
<p>Before we begin, I would like to tell you that if you are using Blazor it would be super awesome if you could use the survey link found on the index of the app when you spin it up. It will greatly help the developers inc Steve Sanderson who made this all happen, he is a true hero for C# developers. Blazor is still in an Alpha state but the more of us that report bugs and mention the amazing parts then the faster we can get this off the ground.</p>

##### Let’s begin.

<p>Open up the Client solution and you will see all the usual properties, dependencies etc.. and you will see two folders. Pages and Shared, shared are considered anything that will be used across multiple pages/areas of your app and the pages themselves and individual pages. This is not a set in stone method or naming convention but one that the team at Blazor have gone with.</p>

{{< figure src="https://miro.medium.com/max/327/1*f_sA6G4lFTBCPoWovl87aA.png" title="Project layout">}}

<p>The first thing we will be doing is creating a login.cshtml page within the Pages folder. At the time of recording this tutorial, Blazor has no view template to use, so I will be adding a razor view.</p>

{{< figure src="https://miro.medium.com/max/355/1*kY3wRtIWq49Ec9UYB9FqBg.png" title="Login.cshtml" >}}
<p>Ignore all the other files in the pages folder for now, or delete them for a cleaner looking directory, though I like to keep them around while doing setup so I can see how the Blazor team do it their way.</p>
<p>So at the top of the page we add a “@page “/login”” this is what we use to give the URL. so ours will be “http://localhost:57778/login”. Nice and easy!
</p>

{{< figure src="https://miro.medium.com/max/266/1*hi15K_EkG5HPOFSF6df2Kw.png" title="Login.cshtml" >}}

<p>Next let’s create the form. Bootstrap comes with this template so we shall use that for ease, feel free to create your own jazzy forms if you like :) As we did in part one, just an email address and password is required for our login tutorial.
</p>
<p>To create linked properties to the form we will create two properties, one for email and the other for password, then we will add a “bind” event to the input html tags which will link the two together in the form of two way binding.</p>

{{< figure src="https://miro.medium.com/max/992/1*937nQ7RMkmA2DC7JwpQgXw.png" >}}

<p>Now let’s create an event on the submit button to make sure we have hooked it up correctly. I will show you how the C# Console.Writeline() and now write to browser consoles like javascripts console.log(); When you click on Submit it will fire the method it is attached to using the “onchange” event and write the username and password to the console. launch the web app when ready and fill the form and hit submit!</p>

{{< figure src="https://miro.medium.com/max/1015/1*lEAmgCbQTDQkBkypUUQfxA.png" title="Login.cshtml">}}

{{< figure src="https://miro.medium.com/max/1033/1*ysAjQDlq9WCLbIGB49LqKQ.png" title="Web browser /login">}}

<p>As you can see we successfully show the username and password which means we have hooked it up correctly, the “WASM” is the Web Assembly which is the core of what makes Blazor run in the web browser, it is the result of the C# code getting compiled down so that a web browser is able to read the code, for more info on web assembly go to WebAssembly. The next phase is setting up our HTTP method to send the form to the Server.</p>
<p>Create a new property called “Token” underneath email and password. At the top of the page add “@inject HttpClient Http” This is where we will inject the standard Http client that we all know and love into our page.</p>
<p>We also need to move our “TokenViewModel” from the server solution to the “Shared” solution, and this is another place Blazor is amazing for, we can share models across both the UI client side and the back end server side!! and don’t forget to change the namespace. Build the application as well to make sure you have changed it in all the right places.</p>

{{< figure src="https://miro.medium.com/max/383/1*GctA-mbOOnq2P6peL-MGMw.png" title="Project structure">}}
<p>We also need to add the Password property into the TokenViewModel, we are adding this in now but the password will not be needed at this stage or until Part 3 of this tutorial where we do database integration.</p>

{{< figure src="https://miro.medium.com/max/408/1*ldosGvNLh4WbzoZ5-vpdcQ.png" title="TokenViewModel">}}

<p>Next we async Task the SubmitForm method as we will be using the HTTP async methods to call the controller. We will then new up a TokenViewModel and pass in the property values. Once this is done we can fire up the app and give it a go, when you hit submit, using the Console.WriteLine() in the method we should now receive our token from the controller, wala!</p>

{{< figure src="https://miro.medium.com/max/1009/1*Li_7y7LZzB9hvbEbUdnxSA.png" title="Login.cshtml">}}
<p>I don’t know about you guys but this is sooooo much easier in Blazor than using JavaScript library's.</p>
<p>At this point we can save the token to local storage for use around a more built app, this is a bit our of the scope of this tutorial as the Blazor team are still working on having a simple library to do so, but feel free to try out the JavaScript interop which can get the job done.</p>

<p>we will be creating a basic localDb with Entity Framework core and creating the full Authentication/Authorisation with our tokens for the full login experience. See you then! and enjoy Blazor!</p>

### Step One : IdentityDbContext setup
<p>
First step, let’s create an IdentityDbContext which is part of Entity Framework to allow us to connect to the database. We create a Data folder and then insert a new class called ApplicationDbContext, the name is up to you but generally this is what I use as it’s quite generic.
</p>
{{< figure src="https://miro.medium.com/max/1617/1*lRvGSDHhHTzeNGrWLSLDbg.png">}}

<p>Once we have created the ApplicationDbContext we can inherit the IdentityDbContext which means we can use the ASPNet identity users. Then we add in the DbContextOptions<ApplicationDbContext>, this injects the options which we will include in the startup.cs shortly.
</p>

{{< figure src="https://miro.medium.com/max/872/1*y0aTzj9gOUiD4oGZ9ip15g.png">}}

<p>Now we need to hook up the Sql connection string in the appsettings.json which is located at the root lever of the Server project. We will modify or add in the connection string depending on if your file contains a template already.</p>

{{< highlight java>}}
"ConnectionStrings": {
"DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=JwtAuthenticationTutorial;Trusted_Connection=True;MultipleActiveResultSets=true"
}
{{< /highlight>}}

<p>Next we setup the Startup.cs file to utilise the appsettings.json and point to the connection string. Add in the EF namespace Microsoft.EntityFrameworkCore then add in the service AddDbContext as shown below.</p>

{{< figure src="https://miro.medium.com/max/817/1*-f4gjaqgYONMc61w9QjFVg.png" >}}
<p>Now we need to add the migration so we have a migration file ready to create the database. You can do this in package manager with add-migration or use dotnet core sli with dotnet ef migrations add "initial" . You will need to be in the Server project for this to work. Once you have done this you will notice a migrations folder in your Server project.
</p>

{{< figure src="https://miro.medium.com/max/435/1*VCp0vsIvlh3e_qsIDmy0Qg.png" >}}

<p>Now we need to create the database. In package manager console, use update-database and in dotnet core sli use dotnet ef database update</p>
<p>Boom! we have a database, this is why I love Entity framework! :) You can use SSMS or the sql server in VS to view the database if you want to take a look at it.</p>

### Step Two : Registration/Login controller methods

<p> We can now modify the token controller to have a registration and a login method </p>
<p>First we create a private method to inject the UserManager <IdentityUser> _userManager; and add it into the controller.</p>

{{< figure src="https://miro.medium.com/max/980/1*6kLMj5V_8QKIrHoyBGNJQg.png">}}
<p>Now we create the Registration method and hook up the usermanager. As this is a simple tutorial we are not doing anything fancy, just straight up calling the user manager to create a user and because we are going to be having 2 POST methods in the controller we will be creating routes which you can see at the top of the method.</p>
{{< figure src="https://miro.medium.com/max/779/1*xNBppH3VUDJNon0RQEHA8g.png">}}

<p>Next we need to create a login method, this will replace the GenerateToken as the method that sends back a token and the GenerateToken method will simply give the login method a token when requested.</p>

{{< figure src="https://miro.medium.com/max/798/1*ijsS7qJrNbvcC8U-syVp_Q.png">}}

<p>So far so good! we now have a controller that can handle registering a user and logging in a user and sending back a generated token. You can also remove the GenerateToken method and directly call the _tokenService in the Login method, this is completely up to you, the latter would produce less code.</p>
<p>In this final part we will create a registration page, modify the login page and then wala! we will have a fully working JWT authentication registration and login Blazor app.</p>
<p>First, create a new razor view page like we did in Part 2 and copy and paste or re type out the same form. Change the @page name to “/registration” and while your at the top of the page, insert this line which will help us redirect once we login</p>

`@inject Microsoft.AspNetCore.Blazor.Services.IUriHelper UriHelper`

<p>remove the Token property and add in the redirect. For simplicity we are not handling any errors when logging in, I will leave that to you. In this we are handling what we assume will always be a success!
</p>

{{< figure src="https://miro.medium.com/max/1154/1*N9cLKA-znqUrp5vLEZNdWA.png">}}

<p>Go ahead and fire up the application, direct yourself to /registration and then post the form. At this point we have been redirected to the login page where we can now make a small modification to where the API points to.</p>
{{< figure src="https://miro.medium.com/max/1117/1*q6C22T4hmfpoWQAUgXyWnA.png">}}

<p>And now the final bit left to do is fire up the app again and use the login form to get the token back.</p>
<p>Like mentioned in Part 2, we can save the local use javascript interop and then save it to localStorage, but I will leave that up to you.</p>
<p>Also 1 more note, if you are using JWT authentication, it is highly recommended that you use HTTPS. This can easily be achieved in Dotnet Core 2.1 thanks to the controller using it as standard but at the time of writing this I used 2.0 and hence the tutorial does not include HTTPS.</p>
<p>That’s it for this tutorial, hope you enjoyed it and most of all I hope that this will help you in creating your own JWT authentication apps. This was a very basic example of how a registration/login system works. JWT is super powerful and I encourage you to read further on how it can help you solve authentication to different areas of your application.</p>
<p>And remember to support Blazor as it is in my opinion going to be a total game changer to web development :)</p>