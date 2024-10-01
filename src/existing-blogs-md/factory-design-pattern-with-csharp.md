---
title: "Factory Design Pattern With C#"
date: 2023-04-29T20:47:22+03:00
pin : false
draft: false
---

# Factory Design Pattern With Csharp

![](https://miro.medium.com/v2/resize:fit:828/format:webp/0*C-_tIpLaN7rQe8tc.jpeg)

The factory design pattern is a creational pattern that provides a way to create objects without specifying the exact class of object that will be created. 
In a car factory, it could be used to create different types of cars (e.g. sedans, SUVs, trucks) without specifying the exact make and model of each car.

### When to use it?
- When you don’t know ahead of time what class object you need.
- When all of the potential classes are in the same subclass hierarchy.
- To centralize class selection code.
- When you don’t want the user to have to know every subclass.

Here’s an example of how the factory design pattern could be implemented in C# for a car factory:
    
```csharp
abstract class Car {
    public abstract string GetType();
}

class Sedan : Car {
    public override string GetType() {
        return "Sedan";
    }
}

class SUV : Car {
    public override string GetType() {
        return "SUV";
    }
}

class Truck : Car {
    public override string GetType() {
        return "Truck";
    }
}

class CarFactory {
    public static Car GetCar(string carType) {
        switch (carType) {
            case "Sedan":
                return new Sedan();
            case "SUV":
                return new SUV();
            case "Truck":
                return new Truck();
            default:
                return null;
        }
    }
}

class Program {
    static void Main(string[] args) {
        Car sedan = CarFactory.GetCar("Sedan");
        Console.WriteLine(sedan.GetType()); // Output: "Sedan"
    }
}
```

In this example, the ```CarFactory``` class is the factory and the ```Sedan, SUV```, and ```Truck``` classes are the products. The ```GetCar``` method of the ```CarFactory``` class is responsible for creating the appropriate type of car based on the input car type. The factory pattern has encapsulated the object creation logic, making it easy to add new products or change the existing product classes without affecting the client code.

You can use this example as a base and expand it by adding properties or methods to the Car class and its derived classes, like number of doors, engine size, and so on.