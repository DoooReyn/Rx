System.register("chunks:///_virtual/Entry.ts",["cc"],(function(t){var c;return{setters:[function(t){c=t.cclegacy}],execute:function(){c._RF.push({},"c872fJI5HNCMIc/Rq2qtqsU","Entry",void 0);t("environment",{production:!0,api:"http://ec2-52-18-14-235.eu-west-1.compute.amazonaws.com:5000/"});c._RF.pop()}}}));

System.register("chunks:///_virtual/game",["./Entry.ts"],(function(){return{setters:[null],execute:function(){}}}));

(function(r) {
  r('virtual:///prerequisite-imports/game', 'chunks:///_virtual/game'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});