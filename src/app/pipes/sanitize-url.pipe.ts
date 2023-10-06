import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'sanitizeUrl'
})
export class SanitizeUrlPipe implements PipeTransform {
  constructor(private sanitize: DomSanitizer) {}

  transform(value: string): SafeUrl {
    return this.sanitize.bypassSecurityTrustResourceUrl(value);
  }
}
