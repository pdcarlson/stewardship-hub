// /src/lib/parser.js

/**
 * parses a raw text block of purchase items into a structured array.
 * @param {string} rawText - the text pasted from the user.
 * @returns {Array<{itemName: string, cost: number, quantity: number}>} an array of purchase objects.
 */
export const parsePurchaseText = (rawText) => {
  if (!rawText || !rawText.trim()) {
    return [];
  }

  // split the entire text into blocks for each item, separated by one or more blank lines
  const itemBlocks = rawText.trim().split(/\n\s*\n/);
  
  const parsedItems = itemBlocks.map(block => {
    // split each block into lines and filter out any empty lines
    const lines = block.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return null;

    const itemName = lines[0].trim();
    let cost = 0;
    let quantity = 1;

    // find the final cost, which is usually the last line starting with '$'
    const costLine = [...lines].reverse().find(line => line.trim().startsWith('$'));
    if (costLine) {
      cost = parseFloat(costLine.trim().replace('$', ''));
    }

    // try to find a quantity line
    const qtyLine = lines.find(line => line.trim().toLowerCase().startsWith('qty'));
    if (qtyLine) {
      quantity = parseInt(qtyLine.trim().split(' ')[1], 10) || 1;
    }
    
    // final check for valid data
    if (itemName && !isNaN(cost) && cost > 0) {
      return { itemName, cost, quantity };
    }
    
    return null;

  }).filter(item => item !== null); // filter out any blocks that couldn't be parsed

  return parsedItems;
};