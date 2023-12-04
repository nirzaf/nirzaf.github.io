---
title: "Asynchronous Programming With Async Await Task in C#"
description: "Asynchronous Programming With Async Await Task in C#"
heroImage: 'https://res.cloudinary.com/dcx7eongu/image/upload/c_crop,h_640,w_1280/v1700217505/maxresdefault_rnpqjz.jpg'
pubDate: 'May 03 2023'
pin : true
draft: false
tags: ["csharp", "async", "await", "task"]
---

C# and .NET Framework (4.5 & Core) supports asynchronous programming using some native functions, classes, and reserved keywords.

Before we see what is asynchronous programming, let's understand what is synchronous programming using the following console example.

```csharp
static void Main(string[] args)
{
    LongProcess();
            
    ShortProcess();
}

static void LongProcess()
{
    Console.WriteLine("LongProcess Started");

    //some code that takes long execution time 
    System.Threading.Thread.Sleep(4000); // hold execution for 4 seconds

    Console.WriteLine("LongProcess Completed");
}

static void ShortProcess() {
    Console.WriteLine("ShortProcess Started");
            
    //do something here
            
    Console.WriteLine("ShortProcess Completed");    
}
```

Output:

```csharp
LongProcess Started
LongProcess Completed
ShortProcess Started
ShortProcess Completed
```

In the above example, the `LongProcess()` method takes 4 seconds to complete. The `ShortProcess()` method takes a very short time to complete. But the `ShortProcess()` method has to wait for the `LongProcess()` method to complete. This is called synchronous programming.

In synchronous programming, the program execution waits for the current task to complete before moving on to another task. This is the default behavior of the program.

The above program executes synchronously. It means execution starts from the Main() method wherein it first executes the LongProcess() method and then ShortProcess() method. During the execution, an application gets blocked and becomes unresponsive (You can see this in Windows-based applications mainly). This is called synchronous programming where execution does not go to next line until the current line executed completely.

### What is Asynchronous Programming?

In asynchronous programming, the code gets executed in a thread without having to wait for an I/O-bound or long-running task to finish. For example, in the asynchronous programming model, the LongProcess() method will be executed in a separate thread from the thread pool, and the main application thread will continue to execute the next statement.

Microsoft recommends [Task-based Asynchronous Pattern](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/async/task-asynchronous-programming-model) to implement asynchronous programming in the [.NET Framework](https://dotnet.microsoft.com/en-us/download/dotnet-framework) or [.NET Core](https://dotnet.microsoft.com/en-us/download/dotnet-framework) applications using ```async``` , await keywords and ```Task``` or ```Task<TResult>``` class.

Now let's rewrite the above example in asynchronous pattern using ```async``` keyword.

```csharp
static async Task Main(string[] args)
{
    LongProcess();

    ShortProcess();
}

static async void LongProcess()
{
    Console.WriteLine("LongProcess Started");

    await Task.Delay(4000); // hold execution for 4 seconds

    Console.WriteLine("LongProcess Completed");

}

static void ShortProcess() {
    Console.WriteLine("ShortProcess Started");
            
    //do something here
            
    Console.WriteLine("ShortProcess Completed");    
}
```

Output:

```csharp
LongProcess Started
ShortProcess Started
ShortProcess Completed
LongProcess Completed
```

In the above example, the Main() method is marked by the async keyword, and the return type is Task. The async keyword marks the method as asynchronous. Note that all the methods in the method chain must be async in order to implement asynchronous programming. So, the Main() method must be async to make child methods asynchronous.

The LongProcess() method is also marked with the async keyword which makes it asynchronous. The await Task.Delay(4000); holds the thread execute for 4 seconds.

Now, the program starts executing from the async Main() method in the main application thread. The async LongProcess() method gets executed in a separate thread and the main application thread continues execution of the next statement which calls ShortProcess() method and does not wait for the LongProcess() to complete.

## async, await, and Task

Use async along with await and Task if the async method returns a value back to the calling code. We used only the async keyword in the above program to demonstrate the simple asynchronous void method.

The await keyword waits for the async method until it returns a value. So the main application thread stops there until it receives a return value.

The Task class represents an asynchronous operation and Task<TResult> generic class represents an operation that can return a value. In the above example, we used await Task.Delay(4000) that started async operation that sleeps for 4 seconds and await holds a thread until 4 seconds.

The following demonstrates the async method that returns a value.
    
```csharp
static async Task Main(string[] args)
{
    Task<int> result = LongProcess();

    ShortProcess();

    var val = await result; // wait untile get the return value

    Console.WriteLine("Result: {0}", val);

    Console.ReadKey();
}

static async Task<int> LongProcess()
{
    Console.WriteLine("LongProcess Started");

    await Task.Delay(4000); // hold execution for 4 seconds

    Console.WriteLine("LongProcess Completed");

    return 10;
}

static void ShortProcess()
{
    Console.WriteLine("ShortProcess Started");

    //do something here

    Console.WriteLine("ShortProcess Completed");
}
```

Output:

```csharp
LongProcess Started
ShortProcess Started
ShortProcess Completed
LongProcess Completed
Result: 10
```

In the above example, in the static async Task<int> LongProcess() method, Task<int> is used to indicate the return value type int. int val = await result; will stop the main thread there until it gets the return value populated in the result. Once get the value in the result variable, it then automatically assigns an integer to val.

An async method should return void, Task, or Task<TResult>, where TResult is the return type of the async method. Returning void is normally used for event handlers. The async keyword allows us to use the await keyword within the method so that we can wait for the asynchronous method to complete for other methods which are dependent on the return value.

If you have multiple async methods that return the values then you can use await for all methods just before you want to use the return value in further steps.

```csharp
static async Task Main(string[] args)
{
    Task<int> result1 = LongProcess1();
    Task<int> result2 = LongProcess2();
    
    //do something here
    Console.WriteLine("After two long processes.");

    int val = await result1; // wait untile get the return value
    DisplayResult(val);

    val = await result2; // wait untile get the return value
    DisplayResult(val);

    Console.ReadKey();
}

static async Task<int> LongProcess1()
{
    Console.WriteLine("LongProcess 1 Started");

    await Task.Delay(4000); // hold execution for 4 seconds

    Console.WriteLine("LongProcess 1 Completed");

    return 10;
}

static async Task<int> LongProcess2()
{
    Console.WriteLine("LongProcess 2 Started");

    await Task.Delay(4000); // hold execution for 4 seconds

    Console.WriteLine("LongProcess 2 Completed");

    return 20;
}

static void DisplayResult(int val)
{
    Console.WriteLine(val);
}
```

Output:

```csharp
LongProcess 1 Started
LongProcess 2 Started
After two long processes.
LongProcess 2 Completed
LongProcess 1 Completed
10
20
```

In the above program, we do await result1 and await result2 just before we need to pass the return value to another method.

Thus, you can use async, await, and Task to implement asynchronous programming in .NET Framework or .NET Core using C#.

## Conclusion

In this article, we learned about asynchronous programming in C# using async, await, and Task. We also learned how to implement asynchronous programming in .NET Framework or .NET Core using C#.

## References

* [Asynchronous programming with async and await](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/async/)
* [Task-based Asynchronous Pattern](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/async/task-based-asynchronous-programming)
* [Asynchronous programming](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/async/index)
* [Asynchronous programming with async, await, Task in C#](https://www.tutorialsteacher.com/articles/asynchronous-programming-with-async-await-task-csharp)









