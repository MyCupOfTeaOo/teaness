```js
import Excel from "exceljs/dist/exceljs.min.js";
import moment from "moment";

export const englishAlphabetTable = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z"
];

export function radix26(num, positions = []) {
  const high = Math.floor(num / 26);
  const low = num % 26;
  positions.unshift(low);
  if (high > 0) {
    return radix26(high, positions);
  }
  return positions.map(num => englishAlphabetTable[num]).join();
}

export const englishAlphabet = new Proxy(englishAlphabetTable, {
  get: function(target, name) {
    return radix26(parseInt(name, 10)) || "";
  }
});

/* eslint no-param-reassign: 0 */

export default function({ sheetName, columns, rows, filename, title }) {
  const workbook = new Excel.Workbook();
  workbook.creator =
    "tea github:https://github.com/tz310200/BrowserExportExcel";
  workbook.lastModifiedBy =
    "tea github:https://github.com/tz310200/BrowserExportExcel";
  workbook.created = moment().toDate();
  workbook.modified = moment().toDate();
  workbook.lastPrinted = moment().toDate();
  workbook.views = [
    {
      x: 0,
      y: 0,
      width: 10000,
      height: 20000,
      firstSheet: 0,
      activeTab: 1,
      visibility: "visible"
    }
  ];

  const worksheet = workbook.addWorksheet(sheetName);

  const { cols, allMerge } = analysisColumns(columns);
  worksheet.columns = cols;
  // TITLE
  worksheet.mergeCells(1, 1, 1, cols.length);
  const TITLE = worksheet.getCell("A1");
  TITLE.value = title;
  TITLE.alignment = { vertical: "middle", horizontal: "center" };
  TITLE.font = { size: 16, bold: true, color: { argb: "FF008000" } };
  const TITLERow = worksheet.getRow(1);
  TITLERow.height = 25;
  worksheet.addRows(rows);

  allMerge.forEach(coordinate => {
    worksheet.mergeCells(coordinate);

    worksheet.getCell(
      englishAlphabet[coordinate[1] - 1] + coordinate[0]
    ).alignment = {
      vertical: "middle",
      horizontal: "center"
    };
  }); // 合并表头
  workbook.xlsx.writeBuffer().then(data => {
    const blob = new Blob([data], { type: "application / octet-stream" });
    const a = document.createElement("a");
    const turl = window.URL.createObjectURL(blob); // 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
    a.href = turl;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(turl);
  });
}

const init = {
  width: 20
};

const transformKey = {
  header: "headerName",
  key: "field"
};

function analysisColumns(columns) {
  const allMerge = [];
  //   const mergeCell = [];
  const depth = Math.max(...columns.map(element => getDepth(1, element)));
  const LeafNodeNumList = columns.map(element => getLeafNodeNum(element));
  const cols = [];
  columns.forEach((colObj, colIndex) =>
    getEveryColumns(
      cols,
      [""],
      colObj,
      LeafNodeNumList,
      depth,
      allMerge,
      [...Array(colIndex)]
        .map((_, index) => LeafNodeNumList[index])
        .reduce((acc, cur) => acc + cur, 0),
      1,
      1
    )
  );

  return {
    cols,
    allMerge
  };
}

// 转化ag-grid列配置
function transformColumns(colObj) {
  return {
    ...colObj,
    header: colObj[transformKey.header],
    key: colObj[transformKey.key],
    width: init.width
  };
}

// 获取每单列配置
function getEveryColumns(
  cols,
  header,
  colObj,
  LeafNodeNumList,
  depth,
  allMerge,
  forwardLeft,
  forwardBottom,
  titleLength,
  prevDepth = 0
) {
  const newObj = transformColumns(colObj);
  const newHeader = header.concat([newObj.header]);
  const coordinate = [];
  coordinate[0] = forwardBottom + 1; // row
  coordinate[1] = forwardLeft + 1; // col
  const downDepth = getDepth(0, colObj);
  coordinate[2] =
    forwardBottom + 1 - titleLength === depth
      ? forwardBottom + 1
      : forwardBottom + depth - downDepth - prevDepth; // row2
  coordinate[3] = forwardLeft + colObj.leafNodeNum; // col2
  if (coordinate[0] !== coordinate[2] || coordinate[1] !== coordinate[3]) {
    allMerge.push(coordinate);
  }
  if (Array.isArray(colObj.children)) {
    return colObj.children.forEach((element, index) => {
      getEveryColumns(
        cols,
        newHeader,
        element,
        LeafNodeNumList,
        depth,
        allMerge,
        [...Array(index)]
          .map((_, index2) => colObj.children[index2].leafNodeNum)
          .reduce((acc, cur) => acc + cur, forwardLeft),
        coordinate[2],
        titleLength,
        prevDepth + depth - downDepth - prevDepth
      );
    });
  }
  cols.push({
    ...newObj,
    header: newHeader
  });
  return 1;
}

// 获取最大深度
function getDepth(depth, element) {
  if (Array.isArray(element.children))
    return Math.max(
      depth,
      ...element.children.map(element2 => getDepth(depth + 1, element2))
    );
  return depth;
}

// 获取叶子结点数
function getLeafNodeNum(element) {
  if (Array.isArray(element.children)) {
    const leafNodeNum = element.children.reduce((acc, cur) => {
      return acc + getLeafNodeNum(cur);
    }, 0);
    element.leafNodeNum = leafNodeNum;
    return leafNodeNum;
  }
  element.leafNodeNum = 1;
  return 1;
}

```