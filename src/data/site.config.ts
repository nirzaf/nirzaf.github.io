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
    title: 'DotNet Blogs by Dotnet Evangelist ', // Site title.
    description: 'Expert tutorials and insights on .NET development, covering C#, ASP.NET, and best practices. Learn from a passionate Dotnet Evangelist.', // Description to display in the meta tags
    lang: 'en-GB',
    ogLocale: 'en_GB',
    shareMessage: 'Share this post', // Message to share a post on social media
    paginationSize: 9 // Number of posts per page
}