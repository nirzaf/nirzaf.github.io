---
title: "Dictionaries in C#"
date: 2023-05-01T22:19:17+03:00
draft: false
pin : false
tags: ["csharp", "dictionaries", "hashmaps"]

---

# Csharp Dictionaries and Hashmaps

## Dictionary

A dictionary is a collection of key-value pairs. It is a data structure that is used to store data in the form of key-value pairs. The key-value pair is also referred to as an entry. The key is used to retrieve the data associated with it. The key must be unique and immutable. The value can be changed. The value can be of any type. The key and value can be of the same type or of different types.

Dictionary Characteristics
- Dictionary<TKey, TValue> stores key-value pairs.
- Comes under System.Collections.Generic namespace.
- Implements IDictionary<TKey, TValue> interface.
- Keys must be unique and cannot be null.
- Values can be null or duplicate.
- Values can be accessed by passing associated key in the indexer 
e.g. ```myDictionary[key]``` Elements are stored as ```KeyValuePair<TKey, TValue>``` objects.

### Creating a Dictionary

You can create the Dictionary<TKey, TValue> object by passing the type of keys and values it can store. The following example shows how to create a dictionary and add key-value pairs.

```csharp
using System;
using System.Collections.Generic;

namespace Dictionary
{
    class Program
    {
        static void Main(string[] args)
        {
            Dictionary<string, string> capitals = new Dictionary<string, string>();
            capitals.Add("England", "London");
            capitals.Add("Germany", "Berlin");
            capitals.Add("Russia", "Moscow");
            capitals.Add("USA", "Washington");
            capitals.Add("Ukraine", "Kyiv");

            foreach (KeyValuePair<string, string> keyValue in capitals)
            {
                Console.WriteLine(keyValue.Key + " - " + keyValue.Value);
            }

            Console.WriteLine("The capital of England is " + capitals["England"]);
            Console.WriteLine("The capital of Germany is " + capitals["Germany"]);
            Console.WriteLine("The capital of Russia is " + capitals["Russia"]);
            Console.WriteLine("The capital of USA is " + capitals["USA"]);
            Console.WriteLine("The capital of Ukraine is " + capitals["Ukraine"]);

            capitals.Remove("USA");

            Console.WriteLine("The capital of USA is " + capitals["USA"]);
        }
    }
}
```

### Dictionary Class Hierarchy

![](https://www.tutorialsteacher.com/Content/images/csharp/generic-dictionary.png)

### Dictionary Methods

The Dictionary<TKey, TValue> class provides various methods to perform different operations on the dictionary. The following table lists some of the commonly used methods of the Dictionary<TKey, TValue> class.

| Method | Description |
| --- | --- |
| Add(TKey, TValue) | Adds an element with the specified key and value into the dictionary. |
| Clear() | Removes all the elements from the dictionary. |
| ContainsKey(TKey) | Checks whether the specified key exists in the dictionary. |
| ContainsValue(TValue) | Checks whether the specified value exists in the dictionary. |
| Remove(TKey) | Removes the element with the specified key from the dictionary. |
| TryGetValue(TKey, out TValue) | Gets the value associated with the specified key. |
| Count | Gets the number of elements in the dictionary. |

### Dictionary Properties

The Dictionary<TKey, TValue> class provides various properties to get information about the dictionary. The following table lists some of the commonly used properties of the Dictionary<TKey, TValue> class.

| Property | Description |
| --- | --- |
| Comparer | Gets the IEqualityComparer<T> that is used to determine equality of keys for the dictionary. |
| Keys | Gets a collection containing the keys in the dictionary. |
| Values | Gets a collection containing the values in the dictionary. |


## References

- [https://www.tutorialsteacher.com/csharp/csharp-dictionary](https://www.tutorialsteacher.com/csharp/csharp-dictionary)