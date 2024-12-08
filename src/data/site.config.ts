interface SiteConfig {
	author: string
	title: string
	description: string
	lang: string
	ogLocale: string
	shareMessage: string
	paginationSize: number
}

export const siteConfig: SiteConfig = {
	author: 'M.F.M Fazrin', // Site author
	title: '.Net Evangelist | Explore & Enhance Your Skills in .Net & More ', // Site title.
	description: 'Explore the latest insights, tutorials, and best practices in .NET development from a passionate Dotnet Evangelist. Stay up-to-date with cutting-edge technologies and enhance your skills in C#, ASP.NET, and more.', // Description to display in the meta tags
	lang: 'en-GB',
	ogLocale: 'en_GB',
	shareMessage: 'Share this post', // Message to share a post on social media
	paginationSize: 9 // Number of posts per page
}
