
//%block="Barcode"
//%icon="\uf02a"
//%color="#593de3"
namespace barcode {

    let anmt = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    function decEncode(nvl: number, bvl: number, dvl: number): string {
        let sti = ""
        let ani = nvl
        if (ani > 0) {
            while (ani > 0) {
                sti = anmt.charAt(ani % bvl) + sti
                ani = Math.floor(ani / bvl)
            }
        } else {
            sti = anmt.charAt(0)
        }
        if (dvl <= 0) {
            return sti
        }
        if (dvl - sti.length > 0) {
            while (dvl - sti.length > 0) {
                sti = anmt.charAt(0) + sti
            }
        }
        return sti
    }

    //%blockid=barcode_genbitpattern
    //%block="generate bit pattern by widebar: $wideBars narrowbar: $narrowBars"
    //%group="pattern generator"
    //%weight=10
    export function genBitPattern(wideBars: number, narrowBars: number): string[] {
        if (wideBars > narrowBars) {
            throw (`The number of thick bars must not be more than the thin bars. widebar: ${wideBars}, narrowbar: ${narrowBars}`);
        }

        const totalBars = wideBars + narrowBars;
        const patterns: string[] = [];
        const maxPatterns = Math.pow(2, totalBars);

        for (let i = 0; i < maxPatterns; i++) {
            const binaryPattern = decEncode(i,2,totalBars)
            const wideCount = binaryPattern.split('1').length - 1;
            const narrowCount = binaryPattern.split('0').length - 1;

            if (wideCount === wideBars && narrowCount === narrowBars) {
                patterns.push(binaryPattern);
            }
        }
        
        patterns.reverse()

        return patterns;
    }

    function checkAnum(istr:string) {
        for (let i = 0;i < istr.length; i++) {
            if (!(anmt.includes(istr.charAt(i)))) return false
        }
        return true
    }

    function addAnum(istr:string,nv:number) {
        let ustr = "", cstr = ""
        let anv = 0
        for (let i = 0;i < istr.length;i++) {
            cstr = istr.charAt(i)
            anv = anmt.split("").indexOf(cstr)
            anv = Math.min(anv + nv,anmt.length - 1)
            cstr = anmt.charAt(anv)
            ustr += cstr
        }
        return ustr
    }

    function sumAnum(istr:string) {
        let cnv = 0, nv = 0
        let cstr = ""
        for (let i = 0;i < istr.length;i++) {
            cstr = istr.charAt(i)
            nv = anmt.split("").indexOf(cstr)
            cnv += nv
        }
        return cnv
    }

    //%blockid=barcode_genwidthpattern
    //%block="generate width pattern by bitlen: $bitlen bitsplit: $splitbit"
    //%group="pattern generator"
    //%weight=5
    export function genWidthPattern(bitlen:number,splitbit:number) {
        if (splitbit >= bitlen) throw (`The number of bit splits will be Must not be more than the number of bits. bitlen: ${bitlen}, splitbit: ${splitbit}`)
        let nnv = 0, bnnv = 0
        let uustr = ""
        while (true) {
            uustr = decEncode(nnv,anmt.length,splitbit)
            uustr = addAnum(uustr,1)
            nnv += 1
            if (sumAnum(uustr) == bitlen) break;
        }
        for (let ii = 0;ii < uustr.length;ii++) { bnnv = Math.max(bnnv,anmt.indexOf(uustr.charAt(ii))) }
        let maxpattern = Math.pow(bnnv,splitbit)
        let patterns: string[] = []
        for (let nn = 0;nn < maxpattern;nn++) {
            for (let ii = 0;ii < bnnv;ii++) {
                uustr = decEncode(nn+ii,bnnv,splitbit)
                uustr = addAnum(uustr,1)
                if (sumAnum(uustr) == bitlen) {
                    patterns.push(uustr)
                    nn += ii
                    break;
                }
            }
            continue;
        }
        patterns.reverse()
        return patterns
    }

}