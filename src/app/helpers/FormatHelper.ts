export class FormatHelper {
  public static pad(num: number, size: number): string {
    let s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
  }

  public static tokenize(input: string): any {
    let data: any[] = [];
    input?.split(',').forEach((input) => {
      if (input !== '') {
        data.push({ display: input, value: input });
      }
    });
    return data;
  }

  public static tokenizeWithData(input: string, inputData: any): any {
    let data: any[] = [];
    input?.split(',').forEach((input) => {
      if (input !== '') {
        data.push({ display: inputData.find((d:any) => d.id == input).name, value: input });
      }
    });
    return data;
  }
}
