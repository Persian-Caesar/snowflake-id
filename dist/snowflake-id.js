"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hex2dec_1 = require("./hex2dec");
var Snowflake = /** @class */ (function () {
    function Snowflake(options) {
        options = options || {};
        this.seq = 0;
        this.mid = (options.mid || 1) % 1023;
        this.offset = options.offset || 0;
        this.lastTime = 0;
    }
    Snowflake.prototype.generate = function () {
        var time = Date.now();
        var bTime = (time - this.offset).toString(2);
        // get the sequence number
        if (this.lastTime == time) {
            this.seq++;
            if (this.seq > 4095) {
                this.seq = 0;
                // make system wait till time is been shifted by one millisecond
                while (Date.now() <= time) { }
            }
        }
        else {
            this.seq = 0;
        }
        this.lastTime = time;
        var bSeq = this.seq.toString(2), bMid = this.mid.toString(2);
        // create sequence binary bit
        while (bSeq.length < 12)
            bSeq = "0" + bSeq;
        while (bMid.length < 10)
            bMid = "0" + bMid;
        var bid = bTime + bMid + bSeq;
        var id = "";
        for (var i = bid.length; i > 0; i -= 4) {
            id = parseInt(bid.substring(i - 4, i), 2).toString(16) + id;
        }
        return (0, hex2dec_1.hexToDec)(id);
    };
    return Snowflake;
}());
exports.default = Snowflake;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25vd2ZsYWtlLWlkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Nub3dmbGFrZS1pZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFxQztBQU9yQztJQU1FLG1CQUFZLE9BQXdCO1FBQ2xDLE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7SUFDcEIsQ0FBQztJQUVELDRCQUFRLEdBQVI7UUFDRSxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDeEIsSUFBTSxLQUFLLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUvQywwQkFBMEI7UUFDMUIsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksRUFBRSxDQUFDO1lBQzFCLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUVYLElBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLEVBQUUsQ0FBQztnQkFDcEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBRWIsZ0VBQWdFO2dCQUNoRSxPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDaEMsQ0FBQztRQUNILENBQUM7YUFFSSxDQUFDO1lBQ0osSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDZixDQUFDO1FBRUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFFckIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQzdCLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU5Qiw2QkFBNkI7UUFDN0IsT0FBTyxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUU7WUFDckIsSUFBSSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFFcEIsT0FBTyxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUU7WUFDckIsSUFBSSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFFcEIsSUFBTSxHQUFHLEdBQUcsS0FBSyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBRVosS0FBSyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ3ZDLEVBQUUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDOUQsQ0FBQztRQUVELE9BQU8sSUFBQSxrQkFBUSxFQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3RCLENBQUM7SUFDSCxnQkFBQztBQUFELENBQUMsQUF2REQsSUF1REMifQ==