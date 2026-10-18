import { DOCUMENT, Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import moment from 'moment';
import { environment } from '../../../environments/environment.prod';
import { saveAs } from 'file-saver';

@Injectable({
    providedIn: 'root'
})
export class CommonService {
    private renderer: Renderer2;
    routerURL: any
    walletDetails = new BehaviorSubject(false)
    MetaDetails: any = {}
    registerStatus: any = false
    loginStatus = new BehaviorSubject('false')
    profileDetails: any = {}
    connectwallet_ref: any = BsModalRef
    currentyear: any = new Date().getFullYear()
    buymodal_ref: any = BsModalRef
    buysuccessmodal_ref: any = BsModalRef
    buysuccessbehaviour: any = new BehaviorSubject(false)
    loginpage: any = ''
    icorebuydetails: any = {
        status: false,
        rebuyamount: 0
    }
    Site_setting: any = {}
    constructor(private toastr: ToastrService, private router: Router, @Inject(DOCUMENT) private document: Document,
        rendererFactory: RendererFactory2
    ) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    showSkeleton(className: string = 'custom-skeleton') {
        this.renderer.addClass(this.document.body, className);
    }

    hideSkeleton(className: string = 'custom-skeleton') {
        this.renderer.removeClass(this.document.body, className);
    }

    showFor(duration: number = 1000, className: string = 'custom-skeleton') {
        this.showSkeleton(className);
        setTimeout(() => this.hideSkeleton(className), duration);
    }

    openAlert(status: any, message: any) {
        switch (status) {
            case true:
            case "success":
                this.toastr.success(message, '', { timeOut: 5000, closeButton: false });
                break;
            case false:
            case 'false':
            case 'danger':
            case "error":
                this.toastr.error(message, '', { timeOut: 5000, closeButton: false });
                break;
            case "info":
                this.toastr.info(message, '', { timeOut: 5000, closeButton: false });
                break;
            default:
                break;
        }
    }

    redirect(url: any) {
        if (url) {
            this.router.navigateByUrl(url)
        }
    }

    redirect_to_with_query(url: any, obj: any) {
        this.router.navigate([environment.backendUrl + url], { queryParams: obj })
    }

    async copyValue(value: any) {
        if (value) {
            await navigator.clipboard.writeText(value).then(() => {
                this.openAlert("success", 'Copied ');
            }).catch((_err) => {
                this.openAlert("error", 'Failed to Copy ');
            });
        }
    }

    formatNumber(n: any) {
        if (n != '') {
            if (n == 0) return n
            else if (n < 1e3) return n;
            else if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K+";
            else if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M+";
            else if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B+";
            else if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T+";
            else return 0
        } else return 0
    };

    shortAddress(accounts: any, val: any, val1: any) {
        let first = accounts.substring(0, val);
        let last = accounts.substring(val1, 42);
        let shortAcc = `${first}......${last}`;
        return shortAcc
    }

    substring(val: any, start: any, end: any, upper?: any) {
        if (val) {
            if (upper) {
                return (val.substring(start, end)).toUpperCase()
            } else {
                return (val.substring(start, end))
            }
        } else {
            return ''
        }
    }

    toFixed(data: any, val: any) {
        return Number(data).toFixed(val)
    }



    getNumber(x: any) {
        if (Math.abs(x) < 1.0) {
            let e = parseInt(x.toString().split('e-')[1]);
            if (e) {
                x *= Math.pow(10, e - 1);
                x = '0.' + new Array(e).join('0') + x.toString().substring(2);
            }
        } else {
            let e = parseInt(x.toString().split('+')[1]);
            if (e > 20) {
                e -= 20;
                x /= Math.pow(10, e);
                x += new Array(e + 1).join('0');
            }
        }
        return x.toString();
    }

    getSaleType(startTime: any, endTime: any) {
        let startDate = startTime
        let endDate = endTime
        let currentDate = new Date().getTime()
        if (currentDate > endDate) {
            return 'Sale Ended'
        }
        else if (currentDate < startDate) {
            return 'Upcoming'
        }
        else if (currentDate >= startDate && currentDate <= endDate) {
            return 'Sale Live'
        } else {
            return undefined
        }
    }

    dateconvert(value: any) {
        let format = "DD-MM-YYYY | HH:mm:ss"
        return moment(new Date(value)).format(format)
    }

    downloadCSV(csvdata: any, filename: any): void {
        const header = Object.keys(csvdata[0]);
        const csvRows = csvdata.map((row: any) =>
            header.map(field => JSON.stringify(row[field], (_key, value) => value ?? '')).join(',')
        );
        csvRows.unshift(header.join(','));
        const csvContent = csvRows.join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, filename + '.csv');
    }
}
