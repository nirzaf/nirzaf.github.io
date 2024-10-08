import dotnetImage from '../assets/images/categories/dotnet.jpg';
import efcore from '../assets/images/categories/efcore.jpg';
import aspnetcore from '../assets/images/categories/aspnet.jpg';
import designPatterns from '../assets/images/categories/design-patterns.jpg';
import blazor from '../assets/images/categories/blazor.jpg';
import csharp from '../assets/images/categories/csharp.jpg';
import ui from '../assets/images/categories/ui-libraries.jpg';
import azure from '../assets/images/categories/azure.jpg';
import o365 from '../assets/images/categories/o365.jpg';



export const CATEGORIES = [
	{ name: 'EFCore', image: efcore },
	{ name: 'Design Patterns', image: designPatterns },
	{ name: 'ASP.NET Core', image: aspnetcore },
	{ name: '.NET', image: dotnetImage },
	{ name: 'Blazor', image: blazor },
	{ name: 'Csharp', image: csharp },
	{ name: 'UI', image: ui },
	{ name: 'Azure', image: azure },
	{ name: 'O365', image: o365 }
] as const;
