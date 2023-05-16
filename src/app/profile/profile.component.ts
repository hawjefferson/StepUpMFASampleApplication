import { Component, OnInit, Injectable } from '@angular/core';
import { OktaAuthStateService } from '@okta/okta-angular';
import { filter, map, Observable } from 'rxjs';
import { AuthState } from '@okta/okta-auth-js';
import { stringToBase64Url } from '@okta/okta-auth-js/lib/crypto';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  template: `
  <div class="profile-card">
    <div class="shield"></div>
    <style>
    p {
      color:#fff;
    }
    </style>
    <p>You're logged in!
      <span *ngIf="name$ | async as name">
        Welcome, {{name}}<br><br>

     
        Access is <b>{{allowed}}</b><br><br>
        <div *ngIf="show">
          <a href="https://vmo.thecustomerdemo.com/oauth2/default/v1/authorize?client_id=0oa2l3l8trQ7TLkxp3l7&response_type=id_token&response_mode=fragment&scope=openid&redirect_uri=http://localhost:59902/profile&state=296bc9a0-a2a2-4a57-be1a-d0e2fd9bb601&acr_values=urn:okta:loa:1fa:any:ifpossible&nonce=asxad">Step Up MFA</a>
        </div>
        </span>
   
    </p>
  </div>
 
 <!-- <button (click)="click()">Step Up MFA</button> -->
  
  `,
  styleUrls: ['./profile.component.css']
})

@Injectable()
export class ProfileComponent implements OnInit {

  public name$!: Observable<string>;
  
  title = 'the title';
  //public redirectUri: string | undefined;
  public profile: string | undefined;
  public contactNumber: string | undefined;
  public hospital: string | undefined;
  public id_token: string | undefined;
  public expiringVMO: string | undefined;
  public notificationEnabled: boolean | undefined;
  public allowed: string | undefined;
  public show: boolean | undefined;
  constructor(private _oktaAuthStateService: OktaAuthStateService,private http: HttpClient) { }

  click() {
    this.title += "Step Up Notification has been triggered ";
    const url = 'https://vmo.thecustomerdemo.com/oauth2/default/v1/authorize?client_id=0oa2l3l8trQ7TLkxp3l7&response_type=token&response_mode=fragment&scope=openid&redirect_uri=http://localhost:59902/profile&state=296bc9a0-a2a2-4a57-be1a-d0e2fd9bb601&acr_values=urn:okta:loa:2fa:any:ifpossible&max_age=0&nonce=asxad';
    const value = false;
    this.http.post<any>(url, {});
   // window.location.url = url;
   // this.http.get(url, { observe: 'response' }).subscribe(resp => resp.headers.get('location'));
    //this.http.post(url, { observe: 'response' }).subscribe(resp => resp.headers.get('location'))
   /*
    this.http.get<any>(url).subscribe(data => {
        console.log(data);
    })*/
    console.log(this.title);
    //location.reload();
  }

  click2() {
    this.title += "Notification Enabled was clicked";
    const url = 'https://ramsayvmo.workflows.okta.com/api/flo/0f6dc219ef549c5ce7068598c638916b/invoke';
    const value = true;
    //return this.http.post<any>(url, value);

    this.http.post<any>(url, { value: value }).subscribe(data => {
        console.log(data);
    })
    console.log(this.title);
   // location.reload();
  }

  public ngOnInit(): void {

    this.name$ = this._oktaAuthStateService.authState$.pipe(
      filter((authState: AuthState) => !!authState && !!authState.isAuthenticated),
      map((authState: AuthState) => authState.idToken?.claims.name ?? '')
    );
    let profile = this._oktaAuthStateService.authState$.pipe(
      filter((authState: AuthState) => !!authState && !!authState.isAuthenticated),
      map((authState: AuthState) => authState.idToken?.claims ?? '')
    );
    let contactNumber = this._oktaAuthStateService.authState$.pipe(
      filter((authState: AuthState) => !!authState && !!authState.isAuthenticated),
      map((authState: AuthState) => authState.idToken?.claims ?? '')
    );
    let hospital = this._oktaAuthStateService.authState$.pipe(
      filter((authState: AuthState) => !!authState && !!authState.isAuthenticated),
      map((authState: AuthState) => authState.idToken?.claims ?? '')
    );
    let idToken= this._oktaAuthStateService.authState$.pipe(
      filter((authState: AuthState) => !!authState && !!authState.isAuthenticated),
      map((authState: AuthState) => authState.idToken?.idToken ?? '')
    );
    let allowed= this._oktaAuthStateService.authState$.pipe(
      filter((authState: AuthState) => !!authState && !!authState.isAuthenticated),
      map((authState: AuthState) => authState.accessToken?.claims ?? '')
    );
    let accessToken= this._oktaAuthStateService.authState$.pipe(
      filter((authState: AuthState) => !!authState && !!authState.isAuthenticated),
      map((authState: AuthState) => authState.accessToken?.accessToken ?? '')
    );
    let email= this._oktaAuthStateService.authState$.pipe(
      filter((authState: AuthState) => !!authState && !!authState.isAuthenticated),
      map((authState: AuthState) => authState.idToken?.claims.email ?? '')
    );
    let groups= this._oktaAuthStateService.authState$.pipe(
      filter((authState: AuthState) => !!authState && !!authState.isAuthenticated),
      map((authState: AuthState) => authState.idToken?.claims ?? '')
    );
    let expiringVMO= this._oktaAuthStateService.authState$.pipe(
      filter((authState: AuthState) => !!authState && !!authState.isAuthenticated),
      map((authState: AuthState) => authState.accessToken?.claims ?? '')
    );
    let notification = this._oktaAuthStateService.authState$.pipe(
      filter((authState: AuthState) => !!authState && !!authState.isAuthenticated),
      map((authState: AuthState) => authState.accessToken?.claims ?? '')
    );

    let landing_page = groups.subscribe(groups=>{
      //console.log(groups);
      console.log(JSON.stringify(groups));
      let claims = JSON.parse(JSON.stringify(groups));
      let all_groups = claims.all_groups;
      if(all_groups.includes('ALL_STAFF')){
      //  this.redirectUri = 'REDIRECT TO TCS LANDING PAGE';
      //  window.location.href =  'https://google.com';
      }else{
       // this.redirectUri = 'REDIRECT TO NON-TCS LANDING PAGE';
        console.log('test');
      }
  });

  profile.subscribe(profile=>{
  //  console.log(JSON.stringify(profile));
    let claims = JSON.parse(JSON.stringify(profile));
    this.profile = claims.profileURL;
  });

  
  expiringVMO.subscribe(expiringVMO=>{
    console.log("expiringVMOs:");
    let claims = JSON.parse(JSON.stringify(expiringVMO));
    console.log("VMOS:"+claims.expiringVMO);
    this.expiringVMO = claims.expiringVMO;
  });

  allowed.subscribe(allowed=>{
    console.log("allowed:");
    let claims = JSON.parse(JSON.stringify(allowed));
    console.log("VMOS:"+claims.accessStatus);
    this.allowed = claims.accessStatus;

    if(this.allowed === "VALID")
      this.show = true;
    else
      this.show = false;
  });

  notification.subscribe(notification=>{
    console.log("notification:");
    let claims = JSON.parse(JSON.stringify(notification));
    console.log("Notification Enabled:"+claims.notificationEnabled);
    this.notificationEnabled = claims.notificationEnabled;
  });

  contactNumber.subscribe(contactNumber=>{
 //   console.log(JSON.stringify(contactNumber));
    let claims = JSON.parse(JSON.stringify(contactNumber));
    this.contactNumber = claims.contactNumber;
  });

  hospital.subscribe(hospital=>{
 //   console.log(JSON.stringify(hospital));
    let claims = JSON.parse(JSON.stringify(hospital));
    this.hospital = claims.hospital;
  });
    
    /*
    email.subscribe(email=>{
      if(email == 'jdoe@tcshub.locals'){
        this.redirectUri = 'https://google.com';
        window.location.href =  'https://google.com';
      }else{
        window.location.href =  'https://okta.com';
        console.log('test');
      }
      console.log('test');
      console.log(email);
    });*/

    this._oktaAuthStateService.authState$.pipe()
    console.log('IDToken:');
    idToken.subscribe(idToken=>{
      console.log(idToken)
      this.id_token = idToken;
    });
    console.log('AccessToken:');
    accessToken.subscribe(accessToken=>{
      console.log(accessToken)
     // this.id_token = idToken;
    });

    console.log('Email:');
    /*
    email.subscribe(email=>{
      if(email == 'jdoe@tcshub.locals'){
        this.redirectUri = 'https://google.com';
        window.location.href =  'https://google.com';
      }else{
        window.location.href =  'https://okta.com';
        console.log('test');
      }
      console.log('test');
      console.log(email);
    });*/

  }
}
