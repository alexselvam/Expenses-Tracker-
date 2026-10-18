import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, map } from "rxjs/operators";
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonService } from '../common/common-service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as CryptoJS from 'crypto-js';

// @ts-ignore
import { ruQErcretenYgn, fdefdDhc } from '../../../gRrcfEeetWnr.js';




@Injectable({
    providedIn: 'root'
})
export class ApiserviceService {
    token: any = "";
    service_domain = environment.backendUrl
    routerURL: any = new BehaviorSubject('')

    private siteDataSubject = new BehaviorSubject<any>(null);
    siteData$ = this.siteDataSubject.asObservable();

    private cmsDataSubject = new BehaviorSubject<any>(null);
    cmsData$ = this.cmsDataSubject.asObservable();
    private cartSource = new BehaviorSubject<any>({ total: 0, data: { items: [] } });
    cart$: any = this.cartSource.asObservable();

    constructor(private httpClient: HttpClient, private router: Router, private commonService: CommonService, private spinner: NgxSpinnerService) { }

    random() {
        const typedArray = new Uint8Array(1)
        const randomValue = crypto.getRandomValues(typedArray)[0]
        const randomFloat = randomValue / Math.pow(2, 8)
        return randomFloat
    }

    //JWT
    randomStringRefferal() {
        let result = '';
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < 6) {
            result += characters.charAt(Math.floor((this.random()) * charactersLength));
            counter += 1;
        }
        return result;
    }

    getGen(url: any, time?: any) {
        let genT = this.randomStringRefferal()
        url = url + '/' + genT
        // let ex_date = Math.round(time / 1000) + 10
        let ex_date = Math.round(time / 1000) + (3 * 60);
        const payload = {
            exp: ex_date,// tokens expiry date in milliseconds
            isHuman: true,
        };
        let token = this.signToken(payload, url)
        let encrtpted_genT = ruQErcretenYgn(genT);
        return { token: token, encrtpted_genT: encrtpted_genT }
    }

    base64url(source: any) {
        let encodedSource = CryptoJS.enc.Base64.stringify(source);
        while (encodedSource.endsWith('=')) {
            encodedSource = encodedSource.slice(0, -1)
        }
        encodedSource = encodedSource.replace(/\+/g, '-');
        encodedSource = encodedSource.replace(/\//g, '_');
        return encodedSource;
    }

    signToken(payload: any, key: any) {
        let secret = key;
        let token: any = this.encodeToken(payload);
        let signature: any = CryptoJS.HmacSHA256(token, secret);
        signature = this.base64url(signature);
        let signedToken = token + "." + signature;
        return signedToken;
    }

    encodeToken(payload: any) {
        let header = {
            "alg": "HS256",
            "typ": "JWT"
        };
        let stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
        let encodedHeader = this.base64url(stringifiedHeader);
        let stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(payload));
        let encodedData = this.base64url(stringifiedData);
        let token = encodedHeader + "." + encodedData;
        return token
    }

    handleError(error: HttpErrorResponse) {
        let errorMessage = "Unknown error!";
        if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
        } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(() => errorMessage);
    }

    private extractData(res: any) {
        let body: any = res;
        if (!body.status && body.statusCode == 700) {
            sessionStorage.clear();
            window.location.assign("/");
        } else {
            return body || {};
        }
    }

    getHeadersTime() {
        return new Promise((resolve, _reject) => {
            this.httpClient
                .get(environment.backendUrl + 'BaTalesmi')
                .pipe(map(this.extractData), catchError(this.handleError)).subscribe((res: any) => {
                    resolve(res)
                })
        })
    }

    requestcondition: any = { token: '', url: '' }

    public postRequest(url: any, requestData: any) {
        return new Promise((resolve, _reject) => {
            let bearertoken: any = sessionStorage.getItem('traker_TOKEN') ? sessionStorage.getItem('traker_TOKEN') : ''
            console.log(bearertoken, "KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK");

            if (this.requestcondition.token == bearertoken && this.requestcondition.url == url) {
                resolve({ status: false, message: 'Your request is already in process' })
            }
            else {
                this.requestcondition.token = bearertoken
                this.requestcondition.url = url
                this.getHeadersTime().then((timedata: any) => {
                    let tokenHandling = this.getGen(this.service_domain + url, timedata.data)
                    let data_send = ruQErcretenYgn(requestData)
                    const headers = new HttpHeaders()
                        .set("cache-control", "no-cache")
                        .set("content-type", "application/json")
                        .set("authorization", 'Bearer ' + bearertoken)
                        .set('gdvuduh-hfayfla', tokenHandling.token)
                        .set('ybdgfug-fhjsyhb', tokenHandling.encrtpted_genT)
                    this.httpClient
                        .post(environment.backendUrl + url, { data: data_send }, { headers: headers })
                        .pipe(map(this.extractData), catchError(this.handleError)).subscribe((res: any) => {
                            res = JSON.parse(fdefdDhc(res))
                            this.requestcondition.token = ''
                            this.requestcondition.url = ''
                            if (res.site_maintain_status) {
                                this.routerURL.next('/undermaintenance')
                                this.router.navigateByUrl('/undermaintenance')
                                this.spinner.hide()
                            } else if (res.logout_status) {
                                this.logout(true)
                            }
                            else if (res.vpn_status) {
                                this.commonService.openAlert('danger', res.message)
                                this.router.navigateByUrl('/')
                                this.logout(true)

                            } else {
                                resolve(res)
                            }
                        })
                })
            }
        })
    }

    public postFileRequest(url: any, requestData: any) {
        return new Promise((resolve, _reject) => {
            this.getHeadersTime().then((timedata: any) => {

                let tokenHandling = this.getGen(this.service_domain + url, timedata.data)
                let bearertoken: any = sessionStorage.getItem('traker_TOKEN') ? sessionStorage.getItem('traker_TOKEN') : ''

                const headers = new HttpHeaders()
                    .set("cache-control", "no-cache")
                    .set("authorization", 'Bearer ' + bearertoken)
                    .set('gdvuduh-hfayfla', tokenHandling.token)
                    .set('ybdgfug-fhjsyhb', tokenHandling.encrtpted_genT)
                return this.httpClient
                    .post<any>(environment.backendUrl + url, requestData, { headers: headers })
                    .pipe(map(this.extractData), catchError(this.handleError)).subscribe((res: any) => {
                        res = JSON.parse(fdefdDhc(res))

                        if (res.site_maintain_status) {
                            this.routerURL.next('/undermaintenance')
                            this.router.navigateByUrl('/undermaintenance')
                            this.spinner.hide()

                        } else if (res.logout_status) {
                            this.logout(true)
                        } else if (res.vpn_status) {
                            this.commonService.openAlert('danger', res.message)
                            this.router.navigateByUrl('/')
                            this.logout(true)
                        } else {
                            resolve(res)
                        }
                    })
            })
        })
    }

    public getRequest(url: any) {
        return new Promise((resolve, _reject) => {
            this.getHeadersTime().then((timedata: any) => {

                let tokenHandling = this.getGen(this.service_domain + url, timedata.data)
                let bearertoken: any = sessionStorage.getItem('traker_TOKEN') ? sessionStorage.getItem('traker_TOKEN') : ''
                const headers = new HttpHeaders()
                    .set("cache-control", "no-cache")
                    .set("content-type", "application/json")
                    .set("authorization", 'Bearer ' + bearertoken)
                    .set('gdvuduh-hfayfla', tokenHandling.token)
                    .set('ybdgfug-fhjsyhb', tokenHandling.encrtpted_genT)
                return this.httpClient
                    .get(environment.backendUrl + url, { headers: headers })
                    .pipe(map(this.extractData), catchError(this.handleError)).subscribe((res: any) => {

                        res = JSON.parse(fdefdDhc(res))
                        if (res.site_maintain_status) {
                            this.routerURL.next('/undermaintenance')
                            this.router.navigateByUrl('/undermaintenance')
                            this.spinner.hide()
                        } else if (res.logout_status) {
                            this.logout(true)
                        } else if (res.vpn_status) {
                            this.commonService.openAlert('danger', res.message)
                            this.router.navigateByUrl('/')
                            this.logout(true)
                        } else {
                            resolve(res)
                        }
                    })
            })
        })
    }

    logoutFuncitonality(status?: any) {
        let key = sessionStorage.getItem('traker_TOKEN');
        if (key) {
            this.postRequest('users/logout', {}).then((logoutRes: any) => {
                if (logoutRes.status) {
                    this.commonService.registerStatus = false
                    sessionStorage.clear()
                    this.commonService.walletDetails.next(false)
                    this.commonService.loginStatus.next('')
                    this.commonService.MetaDetails = {
                        mainBalance: 0
                    }
                    if (!status) {
                        this.commonService.openAlert(true, 'Logout successfully')
                    }
                } else {
                    this.commonService.openAlert('danger', logoutRes.message)
                }
            })
        } else {
            this.commonService.registerStatus = false
            sessionStorage.clear()
            this.commonService.walletDetails.next(false)
            this.commonService.loginStatus.next('')
            this.commonService.MetaDetails = {
                mainBalance: 0
            }
            if (!status) {
                this.commonService.openAlert(true, 'Logout successfully')
            }
        }
    }

    logout(status?: any) {
        this.commonService.registerStatus = false
        sessionStorage.clear()
        localStorage.clear()
        window.location.reload()
        this.commonService.walletDetails.next(false)
        this.commonService.loginStatus.next('')
        if (!status) {
            this.commonService.openAlert(true, 'Logout successfully')
        }
        this.spinner.hide()
        this.router.navigate(['']);
        this.commonService.redirect('/')
    }

    shortAddress(account: any) {
        if (account) {
            let first = account.substring(0, 5);
            let last = account.substring(38, 42);
            let shortAcc = `${first}......${last}`;
            return shortAcc
        } else {
            return ''
        }
    }

    shortAddresshash(account: any) {
        if (account) {
            let first = account.substring(0, 5);
            let last = account.substring(62, 66);
            let shortAcc = `${first}......${last}`;
            return shortAcc
        } else {
            return ''
        }
    }

    getSiteData() {
        this.getRequest('userclub/get_site_setting').then((response: any) => {
            this.siteDataSubject.next(response);
        });
    }

    getCMSData() {
        this.getRequest('userclub/cms').then((response: any) => {
            this.cmsDataSubject.next(response);
        });
    }

    getCart() {
        this.getRequest('userclub/mycart').then((response: any) => {
            if (response.status) {
                this.cartSource.next(response);
            }
        });
    }
}
