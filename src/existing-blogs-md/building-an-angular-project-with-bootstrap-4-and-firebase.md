---
title: "Building an Angular Project With Bootstrap 4 and Firebase"
date: 2022-10-18T12:51:54+05:30
draft: false
tags : ["Angular", "Bootstrap", "Firebase"]
---

!["Angular App With Firebase"](https://res.cloudinary.com/dw0ygv1p9/image/upload/v1571642424/1_ocLdKFc0yd5cIZz_oIP_hg_zgvgef.png)

<!--adsense-->

### Part 1: Setting Up The Project

In this tutorial I’ll show you how to start your Angular 5 Project from scratch and add Bootstrap 4 and the Firebase library to your application. This is the perfect application skeleton for your web application project.

{{< youtube 5gT0-9vifuc >}}

### Setting Up The Angular Project

First we need to setup an Angular project. This is done by using Angular CLI (https://cli.angular.io/). If you have not installed Angular CLI on your system first make sure that the command line interface is installed by executing the following command:

`$ npm install -g @angular/cli@latest`

Having installed Angular CLI you can now make use of the ng command. By using this command we’re able to initiate a new Angular project:

`$ ng new ng4fbbootstrap --skip-install`

<amp-auto-ads type="adsense" data-ad-client="ca-pub-5415404685631285"> </amp-auto-ads>

To initiate a new project we need to use the command line parameter new and specify the name of the new project. Furthermore the option --skip-install is used to avoid that NPM dependencies are installed automatically. This is needed because Angular 5 should be used for our application. At the time of writing Angular 5 is not released yet and only available as a Release Candidate version, so that we have to update our package.json file first.

<p>Change into the newly created project folder:</p>

`$ cd ng4fbbootstrap`
<p>Open package.json in your code editor and make sure to update the version information for all Angular packages in the dependencies and devDependencies section to the latest version (e.g. ^5.0.0-rc.1). Furthermore make sure that the version of the typescript package in the devDependencies section is set to version ~2.4.1 as well. The relevant part of package.json should now look like the following:</p>

{{< highlight typescript>}}
"dependencies": {
    "@angular/animations": "^5.0.0-rc.1",
    "@angular/common": "^5.0.0-rc.1",
    "@angular/compiler": "^5.0.0-rc.1",
    "@angular/core": "^5.0.0-rc.1",
    "@angular/forms": "^5.0.0-rc.1",
    "@angular/http": "^5.0.0-rc.1",
    "@angular/platform-browser": "^5.0.0-rc.1",
    "@angular/platform-browser-dynamic": "^5.0.0-rc.1",
    "@angular/router": "^5.0.0-rc.1",
    "@ng-bootstrap/ng-bootstrap": "^1.0.0-beta.5",
    "angularfire2": "^5.0.0-rc.2",
    "bootstrap": "^4.0.0-beta",
    "core-js": "^2.4.1",
    "firebase": "^4.4.0",
    "jquery": "^3.2.1",
    "popper.js": "^1.12.5",
    "rxjs": "^5.4.2",
    "zone.js": "^0.8.14"
  },
  "devDependencies": {
    "@angular/cli": "^1.5.0-beta.4",
    "@angular/compiler-cli": "^5.0.0-rc.1",
    "@angular/language-service": "^5.0.0-rc.1",
    "typescript": "~2.4.1"
  }
{{< /highlight >}}
Execute the package installation via
`$ npm install`

Note: Once the final release of Angular 5 is available you can skip the step of manually updating packaging.json and executing the package installation as an additional step. You can then use `ng new ng4fbbootstrap` to create a new project (dependencies are installed automatically).

In the project folder you can execute the following command to launch the development web server:

`$ ng serve`

<amp-auto-ads type="adsense" data-ad-client="ca-pub-5415404685631285"> </amp-auto-ads>

The server is started and the application can be accessed on http://localhost:4200 as you can see in the following screenshot:

!["Angular Initial Project"](https://res.cloudinary.com/dw0ygv1p9/image/upload/v1571643329/0_4M8XkLRUw5w5pFno_skifc2.png)

### Setting up Firebase

Next step is to include the Firebase in our project. Two steps are needed here:
<ul>
<li>First, a new Firebase project has to be created in the Firebase back-end and the corresponding project settings have to be made available within the Angular application</li>
<li>Second, the Firebase and AngularFire2 libraries have to be added to the project</li>
</ul>

### Creating A Firebase Project

To create a new Firebase project go to the Firebase website https://firebase.google.com and create a new account / sign in with your Google credentials. After you’re being logged in successfully you can click on the link Go To Console to access the Firebase back-end:

!["firebase console"](https://res.cloudinary.com/dw0ygv1p9/image/upload/v1571643484/0_zm1HADJJQ0WSeU1v_rgsxdg.png)

Here you can click on Add project to add a new Firebase project or select one of the existing projects. You’re taken to the project console next:

!["firebase"](https://res.cloudinary.com/dw0ygv1p9/image/upload/v1571643554/0_ygF0hbDRLFfeixF6_gvqinv.png)

Click on the link Add Firebase to your web app to access the following dialog:

!["firebase"](https://res.cloudinary.com/dw0ygv1p9/image/upload/v1571643616/0_uFrkSuE9BqR_KP8c_kjjqm1.png)

Here you can find the JavaScript code which is needed to initialize the Firebase project for your website. However, to include this Firebase configuration in the Angular project we do only need a part of that code snippet. Copy the key-value pairs inside the config object and insert those pairs inside the file `environments/environment.ts` in the following way:

{{< highlight typescript>}}
export const environment = {
  production: false,
  firebase: {
    apiKey: "[...]",
    authDomain: "[...]",
    databaseURL: "[...]",
    projectId: "[...]",
    storageBucket: "[...]",
    messagingSenderId: "[...]"
  }
};
{{</ highlight >}}


The key-value pairs are inserted into a new property named firebase. The same needs to be inserted into `environments/environment.prod.ts:`

{{< highlight typescript>}}
export const environment = {
  production: true,
  firebase: {
    apiKey: "[...]",
    authDomain: "[...]",
    databaseURL: "[...]",
    projectId: "[...]",
    storageBucket: "[...]",
    messagingSenderId: "[...]"
  }
};
{{< /highlight>}}

That’s needed to make the Firebase settings available whether we’re building during development or for production.

<!--adsense-->

### Adding Libraries

Next, let’s add the libraries to our project by executing the following command:

`$ npm install --save firebase@^4.4.0 angularfire2@^5.0.0-rc.2`

That command is downloading and installing both packages, `firebase` and `angularfire2`, into the node_modules folders and adding the dependencies to the package.json file.

Insert the following import statements into `app.module.ts`:

{{< highlight typescript>}}
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
{{< /highlight>}}

Also add the modules AngularFireModule, AngularFireDatabaseModule, and AngularFireAuthModule to the imports aray of the @NgModule decorator in the following way:

{{< highlight typescript>}}
@NgModule({
  declarations: [
    AppComponent,
    AppNavbarComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
{{< /highlight>}}

Please note, that for module AngularFireModule the method initilizeApp is called and that the Firebase configuration (available via environment.firebase) is passed into that method. To gain access to the environment object you need to add the following import statement as well:

`import { environment } from './../environments/environment';`

### Adding Bootstrap 4

Let’s add the Bootstrap 4 library to our project by using NPM again:

`$ npm install --save bootstrap@next`

We need to add @next to the package name because at the time of writing this post Bootstrap 4 is still in beta. The @next addition makes sure that version 4 of Bootstrap is installed, not version 3.
<p>

The NPM command installs Bootstrap 4 into the folder `node_modules/bootstrap` and at the same time makes sure that the dependency is added into the package.json file.</p>
<p>
To make the Bootstrap CSS classes available for the components in our project we need to include the Bootstrap CSS file from `node_modules/bootstrap/dist/css/bootstrap.css` in our project. To do so add the following line in file styles.css:

`@import "~bootstrap/dist/css/bootstrap.css"`

### BootStrap Starter Template

To add a Bootstrap user interface to our sample application we’ll make use of the Bootstrap Starter Template which is available at https://getbootstrap.com/docs/4.0/examples/:
To setup a basic user interface with Bootstrap elements we’re going to use code from the Bootstrap Starter Template which can be found on the Examples page:

!["Bootstrap"](https://res.cloudinary.com/dw0ygv1p9/image/upload/v1571647826/0_fDsOoV69vcWN6JOy_n9kdjr.png)

Clicking on the link Starter template opens up the starter template website in a new browser window. To access the HTML markup code of the starter template just open the browser’s source code view.
<p>
From the source code view we can copy and paste the needed code parts into our application. First let’s copy the following code from the `<body>` -section to the template code in `app.component.html`: </p>
<p>
{{< gist nirzaf b13372bb78b977e8fc6c3a23989dc5a4 >}}

Furthermore we’d like to include the navigation bar from the starter template as well. We do that by first adding a new component to out application by using Angular CLI again:

`$ ng g component app-navbar`

This command creates a new folder `src/app/app-navbar/.` Within that folder you’ll find the following four files:

<ul>
<li>`app-navbar.component.html`</li>
<li>`app-navbar.component.ts`</li>
<li>`app-navbar.component.css`</li>
<li>And a unit test file</li>
</ul>

The component’s template code can be found in file `app-navbar.component.html` Delete the default markup code from that file and copy and paste the following code excerpt from the Bootstrap starter template:

{{< gist nirzaf 6037036dd0be709374fe800fd404d3e6>}}

Next, let’s open `app-navbar.component.ts` and adapt the string value which is assigned to the selector property of the @Component directive from app-app-navbar to app-navbar:

{{< highlight typescript>}}
@Component({
  selector: 'app-navbar',
  templateUrl: 'app-navbar.component.html',
  styles: []
})
{{< /highlight>}}

Now add the `<app-navbar>` element to the template code of AppComponent:

{{< gist nirzaf a0694973945b15995363e090bde20854>}}

Finally some CSS code needs to be added to `styles.css`

{{< highlight typescript>}}
body {
   padding-top: 80px; 
}
.starter-template {
    padding: 3rem 1.5rem;
    text-align: center;
}
{{< /highlight>}}

The result of the application in the browser should now comply with the Bootstrap starter template’ output:
</p>

!["Bootstrap"](https://res.cloudinary.com/dw0ygv1p9/image/upload/v1571649342/0_QHZ_41PTSrSgZlTt_wcn6z0.png)

<!--adsense-->

### Adding ng-Bootstrap

There is one difference between the result we’re getting from our application and the original Bootstrap Starter Template. If you try to open the Dropdown menu item in the navigation bar you’ll notice that no dropdown menu appears. The reason for that is that we’ve only included the Bootstrap CSS file in our project. The JavaScript part of Bootstrap (which is relying on JQuery and Popper.js) has not been added.

<P>
As the Bootstrap JavaScript library is making use of jQuery and is manipulating the DOM directly. For an Angular application any direct DOM manipulations should be avoided and the complete control to update DOM elements should be be given to the Angular framework. Therefore we need another way to include JavaScript-based Bootstrap elements (e.g. the dropdown element) in our Angular application.
</p>

<P>The solution to this problem is to use Bootstrap 4 Angular directives. To make use of those directives you need to add the ng-bootstrap package to your project. The project’s website can be found at https://ng-bootstrap.github.io. The installation is done via NPM again:</p>

`npm install --save @ng-bootstrap/ng-bootstrap`

Having completed the installation the corresponding Angular module NgbModule must be imported in `app.module.ts`:

`import { NgbModule } from '@ng-bootstrap/ng-bootstrap';`

NgbModule needs to be added to the imports array by calling the forRoot() method as you can see in the following:

{{< highlight typescript>}}
imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    NgbModule.forRoot()
  ],
{{< /highlight>}}

Now we can make use of the Bootstrap directives in our template code. For implementing the dropdown menu we’ll need to make use of the following three directives: ngbDropdown, ngbDropdownToggle, and ngbDropdownMenu:

{{< gist nirzaf f0285652c398d0b223d985302fbb8c0a >}}

The result should now look like the following when you click on the menu Category:

!["nav"](https://res.cloudinary.com/dw0ygv1p9/image/upload/v1571650087/0_D53e-Cn_NuSLBO7S_aw55bi.png)

### Retrieving Data From Firebase

Finally, let’s retrieve and display some sample data from the Firebase real time Database. Therefore we assume that the following JSON data structure has already been created in the real time database:

{{< highlight typescript>}}
{
  "courses" : {
    "angular-complete-guide" : {
      "description" : "Master Angular (Angular 2+, incl. Angular 5) and build awesome, reactive web apps with the successor of Angular.js",
      "title" : "Angular - The Complete Guide",
      "url" : "https://codingthesmartway.com/courses/angular2-complete-guide/"
    },
    "learn-ionic3-from-scratch" : {
      "description" : "Create Cross Platform Mobile Applications with Ionic 3, Angular 4, TypeScript and Firebase.",
      "title" : "Learn Ionic 3 From Scratch",
      "url" : "https://codingthesmartway.com/courses/ionic3/"
    },
    "modern-react-with-redux" : {
      "description" : "Master the fundamentals of React and Redux with this tutorial as you develop apps with React Router, Webpack, and ES6",
      "title" : "Modern React With Redux",
      "url" : "https://codingthesmartway.com/courses/modern-react-with-redux/"
    },
    "vuejs2-complete-guide" : {
      "description" : "Vue JS is an awesome JavaScript Framework for building Frontend Applications! VueJS mixes the Best of Angular + React!",
      "title" : "Vue.js 2 - The Complete Guide",
      "url" : "https://codingthesmartway.com/courses/vuejs2-complete-guide"
    }
  }
{{</ highlight >}}
The corresponding data view in the Firebase console should look like the following:

!["firebase console"](https://res.cloudinary.com/dw0ygv1p9/image/upload/v1571650254/0_7P2kxdGtKtN7Ut-C_fzu2uf.png)

To retrieve and display this data in our application we’re adding a new Angular component:

`$ ng g component courses-list`

This creates a new folder `courses-list` in `src/app` and you’ll find the component files within that folder.

<P>
First we need to adapt the implementation of class CoursesListComponent in file `courses-list.component.ts`:
</p>

{{< highlight typescript>}}
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database'; 
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'courses-list',
  templateUrl: 'courses-list.component.html',
  styles: []
})
export class CoursesListComponent implements OnInit {
  coursesObservable: Observable<any[]>;
  constructor(private db: AngularFireDatabase) { }
  ngOnInit() {
    this.coursesObservable = this.getCourses('/courses');
  }
  getCourses(listPath): Observable<any[]> {
    return this.db.list(listPath).valueChanges();
  }
}
{{< /highlight>}}

Here we’re injecting the AngularFireDatabase service into the class constructor. The class contains a method getCourses which takes a database path as a parameter. An observable for the list of courses in the database is retrieved by calling the list method of the AngularFire Database object, passing in the database path, and calling the method valueChanges.

<P>
The getCourses method is used within ngOnInit to retrieve an observable for the path /courses. The observable is stored in the class property coursesObservable.
</p>
<P>
The coursesObservable member is used to access data in the template code in file `courses-list.component.html`:</p>

{{< highlight typescript>}}
`<ul>
    <div *ngFor="let course of coursesObservable | async">
        <ngb-alert type="info" [dismissible]="false">
            <h3><a href="#">{{course.title}}</a> </h3>
            <p>{{course.description}}</p>
            <div>
                <a href="{{course.url}}" target="_blank" class="btn btn-danger">Go To Course</a>
            </div>
        </ngb-alert> 
    </div>
</ul>`
{{< /highlight>}}

To access the coursesObservable in the template code we need to apply the `async` pipe.

<P>
Finally, you need to include the `<courses-list>` element in the template code in `app.component.ts`:</p>

{{< gist nirzaf 303439f21ed278d7bc923c4a3d2cd768 >}}

Now the result in the browser should look like the following:

!["live angular"](https://res.cloudinary.com/dw0ygv1p9/image/upload/v1571650760/0_e3plE8RB6MGUEdPu_zliak6.png)

### Conclusion And Outlook
In this first part we’ve started to build our Angular 5, Bootstrap 4 and Firebase application from scratch. You’ve learn how to setup the project, install the required libraries, and tie everything together. The resulting sample application can be used as an application skeleton for implementing your own features.
<P>In the following parts of this series the application will be enhanced step-by-step. In the next part we’ll focus on adding routes to our application.</p>
<P>This post has been published first on <a href="https://https://codingthesmartway.com/">CodingTheSmartWay.com</a> this is an updated version of it</p>

<img src="https://i.ibb.co/tBPKn2m/thank-you.jpg" alt="thank-you" border="1">