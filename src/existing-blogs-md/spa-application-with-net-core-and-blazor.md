---
title: "Single Page Application With .Net Core and Blazor"
date: 2021-10-27T21:41:31+05:30
draft: false
pin : false
tags : ["C#", ".Net Core", "Blazor", "SPA"]
---

### Introduction

!["Title Image"](https://i.ibb.co/1f7yCMx/1-r8l-WHb-H-mg-Wkl462l-Qs-Yu-Q.jpg)

<p>In this article, we will create a Single Page Application (SPA) using server-side Blazor. We will use an Entity Framework Core database. Single-Page Applications are web applications that load a single HTML page. They dynamically update that page as the user interacts with the app.</p>

<P>We will be creating a sample Employee Record Management System. We will perform CRUD operations on it. A modal popup will display the form to handle user inputs. The form will also have a dropdown list which will bind to a database table. We will also provide a filter option to the user to filter the employee records based on employee name.</p>

<P>We will be using Visual Studio 2017 and SQL Server 2017 for our demo.</p>

<P>Let us look at the final application:</p>

!["Final Application"](https://i.ibb.co/ChT6Fwj/1-w4-PSdj1u-M9j-MFx4-N-fulw.gif)

### What is Server-Side Blazor?

<P>The release 0.5.0 of Blazor allows us to run Blazor applications on the server. This means that we can run the Blazor component server-side on .NET Core. A SignalR connection over the network will handle other functionalities such as UI updates, event handling, and JavaScript interop calls.</p>

### Prerequisites

<ul>
<li>Install the .NET Core 2.1 or above SDK from <a href="https://dotnet.microsoft.com/learn/dotnet/hello-world-tutorial/intro#windowscmd">here</a></li>
<li>Install Visual Studio 2017 v15.7 or above</li>
<li>Install ASP.NET Core Blazor Language Services extension from <a href="https://marketplace.visualstudio.com/items?itemName=aspnet.blazor">here</a></li>
<li>SQL Server 2012 or above.</li>
</ul>

<P>Visual Studio 2017 versions below v15.7 do not support the Blazor framework.</p>

### Source Code

<P>Get the source code for this application from <a href="https://github.com/nirzaf/Blazor-Server-Side-SPA">Github<a></p>

##### Important Note:

<P>This article is valid for Blazor 0.5.0 release. The server-side Blazor might undergo breaking changes in future releases of Blazor.</p>

##### Creating a Table

<P>We will be using two tables to store our data.</p>
<ol>
<li><p>Employee: Used to store employee details. It contains fields such as EmployeeID, Name, City, Department, and Gender.</p></li>
<li><p>Cities: This contains the list of cities. It is used to populate the City field of the Employee table. It contains two fields, CityID and CityName</P></li>
</ol>

<P>Execute the following commands to create both tables:</p>

{{< highlight SQL>}}
CREATE TABLE Employee (  
EmployeeID int IDENTITY(1,1) PRIMARY KEY,  
Name varchar(20) NOT NULL ,  
City varchar(20) NOT NULL ,  
Department varchar(20) NOT NULL ,  
Gender varchar(6) NOT NULL  
)    
GO      
      
CREATE TABLE Cities (      
CityID int IDENTITY(1,1) NOT NULL PRIMARY KEY,      
CityName varchar(20) NOT NULL       
)      
GO
{{< /highlight>}}

<P>Now, we will put some data into the Cities table. We will be using this table to bind a dropdown list in our web application. The user will select the desired city from this dropdown. Use the following insert statements:</p>

{{< highlight SQL >}}
INSERT INTO Cities VALUES('New Delhi');  
INSERT INTO Cities VALUES('Mumbai');  
INSERT INTO Cities VALUES('Hyderabad');  
INSERT INTO Cities VALUES('Chennai');  
INSERT INTO Cities VALUES('Bengaluru');
{{< /highlight>}}

<P>Now, our Database part is complete. So we will proceed to create the server side application using Visual Studio 2017.</p>

#### Create The Server Side Blazor Application

<P>Open Visual Studio and select File >> New >> Project.</p>

!["Create New Project"](https://i.ibb.co/d4V4txw/1-8-Eh0-Zv9u-Aln49u5yq-GGv-AA.png)

<P>After selecting the project, a “New Project” dialog will open. Select .NET Core inside the Visual C# menu from the left panel. Then, select “ASP.NET Core Web Application” from the available project types. For project name, put in ServerSideSPA and press OK.</p>

!["Create Blazor Pages"](https://i.ibb.co/XjrwcxH/1-cb-ZGSKGs-HLOt-Po-Nkjk7-WSQ.png
)
<P>This will create our server-side Blazor solution. You can observe the folder structure in solution explorer, as shown in the below image:</p>

!["Solution Explorer"](https://i.ibb.co/wpwsCJk/1-9b6-Xh-Oy-B7-MMP0n-Ou-RCym-A.png)

#### The solution has two project files:

<ol>
<li><p>ServerSideSPA.App: This is our server-side Blazor app. This project has all our component logic and our services. We will also create our models and data access layer in this project.</p></li>
<li><p>ServerSideSPA.Server: This is the ASP.NET Core hosted application. Instead of running client-side in the browser, the server-side Blazor app will run in the ASP.NET Core host application.</p></li>
</ol>

<P>In future releases of Blazor, these two projects might be merged into one. But for now, the separation is required due to the differences in the Blazor compilation model.</p>

#### Scaffolding the Model to the Application

<P>We are using Entity Framework core database first approach to create our models. We will create our model class in ServerSideSPA.App project.
Navigate to Tools >> NuGet Package Manager >> Package Manager Console. Select “ServerSideSPA.App” from the Default project drop-down. Refer to the image below:</p>

!["Scafolding"](https://i.ibb.co/qpTrVjW/1-3-Aj-B-3k-AOuv-Zs4-K9kb-DCDg.png)

<P>First, we will install the package for the database provider that we are targeting which is SQL Server in this case. Hence, run the following command:</p>

{{< highlight SQL >}} Install-Package Microsoft.EntityFrameworkCore.SqlServer {{< /highlight>}}

<P>Since we are using Entity Framework Tools to create a model from the existing database, we will install the tools package as well. Hence, run the following command:</p>

{{< highlight SQL >}} Install-Package Microsoft.EntityFrameworkCore.Tools {{< /highlight>}}

<P>After you have installed both packages, we will scaffold our model from the database tables using the following command:</p>

{{< highlight SQL >}} Scaffold-DbContext "Your connection string here" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models -Tables Employee, Cities {{< /highlight>}}

<P>Do not forget to put your own connection string (inside “ ”). After this command executes successfully, it creates a models folder inside ServerSideSPA.App project. It contains three class files: myTestDBContext.cs, Cities.cs and Employee.cs. Hence, we have successfully scaffolded our Models using EF core database first approach.</p>

#### Creating the Data Access Layer for the Application

<p>Right-click on ServerSideSPA.App project and then select Add >> New Folder and name the folder DataAccess. We will be adding our class to handle database related operations inside this folder only.</p>

<p>Right click on the DataAccess folder and select Add >> Class.</p>

<p>Name your class EmployeeDataAccessLayer.cs. Open EmployeeDataAccessLayer.cs and put the following code into it:</p>

{{< highlight typescript >}} 
using Microsoft.EntityFrameworkCore;
using ServerSideSPA.App.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ServerSideSPA.App.DataAccess
{
    public class EmployeeDataAccessLayer
    {
        myTestDBContext db = new myTestDBContext();

        //To Get all employees details     
        public List<Employee> GetAllEmployees()
        {
            try
            {
                return db.Employee.AsNoTracking().ToList();
            }
            catch
            {
                throw;
            }
        }

        //To Add new employee record       
        public void AddEmployee(Employee employee)
        {
            try
            {
                db.Employee.Add(employee);
                db.SaveChanges();
            }
            catch
            {
                throw;
            }
        }

        //To Update the records of a particluar employee      
        public void UpdateEmployee(Employee employee)
        {
            try
            {
                db.Entry(employee).State = EntityState.Modified;
                db.SaveChanges();
            }
            catch
            {
                throw;
            }
        }

        //Get the details of a particular employee      
        public Employee GetEmployeeData(int id)
        {
            try
            {
                var employee = db.Employee.Find(id);
                db.Entry(employee).State = EntityState.Detached;
                return employee;
            }
            catch
            {
                throw;
            }
        }

        //To Delete the record of a particular employee      
        public void DeleteEmployee(int id)
        {
            try
            {
                Employee emp = db.Employee.Find(id);
                db.Employee.Remove(emp);
                db.SaveChanges();
            }
            catch
            {
                throw;
            }
        }

        // To get the list of Cities
        public List<Cities> GetCityData()
        {
            try
            {
                return db.Cities.ToList();
            }
            catch
            {
                throw;
            }
        }
    }
}
{{< /highlight>}}

<P>Here, we have defined the methods to handle database operations:</p>

<ul>
<li><p>GetAllEmployees will fetch all the employee data from the Employee table.</p></li>
<li><p>AddEmployee will create a new employee record.</p></li>
<li><p>UpdateEmployee will update the record of an existing employee.</p></li>
<li><p>GetEmployeeData will fetch the record of the employee corresponding to the employee ID passed to it.</p></li>
<li><p>DeleteEmployee will delete the employee record corresponding to the employee id passed to it.</p></li>
<li><p>GetCityData will fetch the list of all the cities from Cities table.</p></li>
</ul>

#### Creating the Service class

<P>Right click on the Services folder and select Add >> Class. Give it a name of “EmployeeService.cs” and click Add. This will add the EmployeeService class to the Services folder.</p>
<P>Open EmployeeService.cs and put the following code into it:</p>

{{< gist nirzaf c8b815c63b113ac1b6b3fe4629495581>}}

<P>We will invoke the methods of EmployeeDataAccessLayer class from our service. The service will be injected into our components. The components will call the service methods to access the database.</p>
<P>At this point in time, the ServerSideSPA.App project has the following structure:</p>

![""](https://i.ibb.co/z6bMRqV/1-2l-Mz8c-i7f-Zwqg8v-OEHVIA.png)

#### Configuring the Service

<P>To make the service available to the components, we need to configure it on the server-side app. Open ServerSideSPA.App >> Startup.cs file. Add the following line inside the ConfigureServices method of the Startup class.</p>

{{< highlight typescript>}} services.AddSingleton<EmployeeService>(); {{< /highlight>}}

<P>Refer to the image below:</p>

![""](https://miro.medium.com/max/650/1*zFNrGOpeXkGUE4s4xQy6gQ.png)

#### Creating The View Component

<P>We will add the Razor page in the ServerSideSPA.App /Pages folder. By default, we have “Counter” and “Fetch Data” pages provided in our application. These default pages will not affect our application. For the sake of this tutorial, delete both of them from the ServerSideSPA.App /Pages folder.</p>
<P>Right-click on ServerSideSPA.App /Pages folder and then select Add >> New Item. An “Add New Item” dialog box will open. Select “ASP.NET Core” from the left panel. Then select “Razor Page” from the templates panel and name it EmployeeData.cshtml. Click Add.</p>

![""](https://miro.medium.com/max/650/1*NtoFELHAZZ8Nnl4-tsBMIg.png)
<P>This will add an EmployeeData.cshtml page to the Pages folder. This razor page will have two files, EmployeeData.cshtml and EmployeeData.cshtml.cs.
Now, we will add code to these pages.</p>

#### EmployeeData.cshtml

<P>Open the EmployeeData.cshtml page and put the following code into it:</p>

{{< gist nirzaf 1f7f78b2beb0509318df51adbc08f500>}}

<P>Let me explain this code. At the top, we have defined the route for this page as “/fetchemployee”. This means if we append “/fetchemployee” to the root URL of the app, we will be redirected to this page.</p>
<P>We are also inheriting EmployeeDataModel class which is defined in EmployeeData.cshtml.cs file. This will allow us to use the methods defined in EmployeeDataModel class.</p>
<P>After this, we have defined a button to add a new employee record. When clicked, this button will open a modal popup to handle the user inputs.</p>
<P>We have also defined a searchbox and a corresponding button to filter the employee records based on employee name. If you enter an employee name and click on the filter button, it will show all matching employee records. If we click on the filter button without entering any value in the search box, it will return all the employee records.</p>
<P>The employee records returned from the database are stored in the empList variable. If the variable is not null, then we will bind the values to a table to display the employee records in a tabular fashion. Each employee record will also have two action links — Edit to edit the employee record, and Delete to delete the employee record.</p>
<P>To handle the user inputs, we are using a form. We are using a single form for both Add Employee and Edit Employee functionality. The form is defined in a modal popup. The modal popup is displayed on the screen based on the value of the Boolean property isAdd. The value of this Boolean property is set in the code behind (.cshtml.cs) page.</p>
<P>The City dropdown list inside the form is binding to our Cities table in the database with the help of the cityList variable. The cityList will be populated as the application boots up.</p>
<P>The form will have a Save button which will invoke the SaveEmployee method. This method is defined in the code behind file to Add or update an employee record.</p>
<P>Similar to Add modal popup, we also have a Delete modal popup. It will be a read-only modal and ask for a confirmation to delete an employee record. Upon clicking “Yes”, it will invoke the DeleteEmployee method to delete the employee record.</p>

#### EmployeeData.cshtml.cs

<P>Open EmployeeData.cshtml.cs and put the following code into it.</p>

{{< gist nirzaf 2e67617941d70756fde8921276a2e46e>}}

<P>Let me explain this code. We have defined a class EmployeeDataModel. It will hold all the methods that we will be using in EmployeeData.cshtml page.</p>
<P>We are injecting our EmployeeService to the EmployeeDataModel class so that the client-side methods can invoke our services.</p>
<P>The variables empList and cityList hold the data from the Employee and Cities tables. The variables are getting populated inside the OnInitAsync to make sure that the data is available to us as the page loads.</p>
<P>We will use the FilterEmp method to filter the employee data based on the employee name property. This property will ignore the text case of the search string. It returns all the records that match either fully or partially with the search string.</p>

<P>Clicking the “Add Employee” button will invoke the AddEmp method. It will initialize an empty instance of Employee model and set the value of the isAdd Boolean flag to true. This will open a modal popup with a form, asking the user to enter a new employee record. Similarly, we have defined an EditEmployee method. It fetches the record of the employee based on the employee id for which it is invoked. It will also set the value of isAdd to true to open the modal popup to edit the employee record.</p>
<P>The SaveEmployee method will check if it is invoked to add a new employee record or to edit an existing employee record. If the EmployeeId property is set, then it is an “edit” request, and we will invoke the Edit method of our service. If EmployeeId is not set, then it is a “create” request, and we will invoke the Create method of our service. We will then fetch the updated employee record by calling the GetEmployee method and will also set the value of isAdd to false, thus closing the modal popup.</p>
<P>The DeleteConfirm method is invoked by clicking the Delete button corresponding to an employee record. It will set the value of the isDelete Boolean flag to true. This will display a Delete confirmation modal popup. Upon clicking YES inside this popup, DeleteEmployee method is invoked. This will delete the employee record and set the isDelete Boolean flag to false to close the modal popup.</p>

#### Adding Link to Navigation menu

<P>The last step is to add the link to our “EmployeeData” page in the navigation menu. Open ServerSideSPA.App/Shared/NavMenu.cshtml page and put the following code into it:</p>

{{< gist nirzaf 91fd598de7e02b653d94beb7c93f9496>}}

<P>This completes our Single Page Application using server-side Blazor.</p>

#### Execution Demo

<P>Press F5 to launch the application.</p>
<P>A web page will open as shown in the image below. The navigation menu on the left is showing a navigation link for the Employee data page.</p>

![""](https://i.ibb.co/b5MVVjj/1-q-RTQZL1hw-U4-Bd44-Vp-B0bw.png)

<P>Clicking on the “Employee data” link will redirect to the EmployeeData view. Here you can see all the employee data on the page. Notice the URL has “/fetchemployee” appended to it.</p>

![""](https://i.ibb.co/bzR9Zdr/1-FK6lu-HJRh-Mwqwa-CXWFZ1mg.png)

<P>Click on the Add Employee button to open the “Add Employee” modal popup. Enter the data in all the fields and click on Save to create a new employee record.</p>

![""](https://i.ibb.co/DMVskVB/1-vob-Tepj-Mb-5-SBf-IRr-Bx-Blw.png)

<P>This will create a new employee record and display the data in the view table. Add a few more records, and the view will be similar to the one shown below:</p>

![""](https://i.ibb.co/ZYL2gn6/1-i-Wp-Tzgkqgir-Eo-Xs6cqd-H2-Q.png)

<P>Clicking on the Edit button will open the modal popup for editing the employee record. Edit the input fields and click on save to update the employee record.</p>

![""](https://i.ibb.co/59M4w4d/1-krqj-P6nr-Jm-JE15t-En-RE3c-A.png)
<P>To filter the employee records, enter the employee name in the search box and click on the Filter button. The search text is case independent. The filter operation will return all the employee records matching the name entered in the search field. Refer to the image below:</p>

![""](https://i.ibb.co/41jqxrx/1-Fvsca-P1-WK-m9-J27-Hg8-ISQ.png)

<P>If you click on the Delete button corresponding to the employee record, it will open a delete confirmation popup asking for a confirmation to delete the employee record.</p>

![""](https://i.ibb.co/c2vdZn1/1-IMZy-WZwffft629-FT0-Zw-Rnw.png)

<P>Clicking on YES will delete the employee data and show the updated list of employees by refreshing the view table.</p>

#### Conclusion

<P>We have created a server-side Blazor application using Entity Framework Core DB first approach with the help of Visual Studio 2017 and SQL Server 2017. We used a modal popup to handle user inputs via a form. We also implemented the search functionality on the employee records.</p>
<P>Please get the source code from GitHub and play around to get a better understanding.</p>