
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

    //%blockid=barcode_genpattern
    //%block="gen barcode pattern in widebar: $wideBars narrowbar: $narrowBars"
    export function genPatterns(wideBars: number, narrowBars: number): string[] {
        if (wideBars > narrowBars) {
            throw (`The number of thick bars must not be more than the thin bars. widebar: ${wideBars}, narrowbar: ${narrowBars}`);
        }

        const totalBars = wideBars + narrowBars;
        const patterns: string[] = [];
        const maxPatterns = Math.pow(2, totalBars); // จำนวนรูปแบบสูงสุด

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

}