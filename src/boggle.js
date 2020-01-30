/* Ana Luisa Mata Sanchez
   Software Development Studio
   Assignment #2 - Test Plan for Boggle Solver
*/

//Trie node
class TrieNode{
     constructor(){
       this.children = new Object();
       this.isEndOfWord = false;
     }
}

//Function for inserting a word into the trie
function insert(root,word){
  let currNode = root;

  if(word.length<16){
    for(let i=0; i<word.length; i++){
        let letter = word.charAt(i);

        //If the letter is not in the children
        if(!currNode.children.hasOwnProperty(letter.toUpperCase())){
          let nextNode = new TrieNode();
          //Add the letter
          currNode.children[letter.toUpperCase()] = nextNode;
          //Move to next node
          currNode = nextNode;
        }else{
          //If letter is in the children, move to next node
          currNode = currNode.children[letter.toUpperCase()];
        }
     }
     currNode.isEndOfWord = true;
   }
}

//FFind a word in the dictonary
function find(root, word){
  let currNode = root;

  for(let i=0; i<word.length; i++){
      //If the letter is not in the children
      let letter = word.charAt(i);
      if(!currNode.children.hasOwnProperty(letter.toUpperCase())){
        //word is not in trie
        return false;
      }else{
        //If letter is in the children, move to next node
        if(currNode.children[letter.toUpperCase()]){
          currNode = currNode.children[letter.toUpperCase()];
        }
      }
  }

  //All letters are in the trie, therefore the word is in the trie
  return currNode.isEndOfWord;

}

//This function traverses all possible paths for a node
function findWords(row, col, grid, dictionary, visited, word, root, words){
  //Mark the node as visited
  visited[row][col] = '1';
  //Add the letter in the node to the word
  word = word + grid[row][col];

  //Look for the word in the dictionary
  if(word.length>2 && find(root, word)){
    words.add(word);
  }

  //Travel through all possible 8 nodes
  for(let r = row-1;r<row+2;r++){
    for(let c = col-1;c<col+2;c++){
      //Check that it can travel to that node and it hasn't been visited yet
      if((r>=0 && r<grid.length)&&(c>=0 && c<grid[0].length) && visited[r][c] !== '1'){
        //Go to said node
        findWords(r,c,grid,dictionary,visited,word,root,words);
      }
    }
  }

  //Remove letter from the node and mark as unvisited to be able to do all combinations (travel to this node again from another node)
  word = word - word.charAt(word.length-1);
  visited[row][col] = '0';
}

//This funtion solves the boggle
function solver(grid, dictionary){
  //Check to see if dictionary and grid are not undefined
  if(dictionary && grid){
    let root = new TrieNode();
    let visited = new Array(grid.length);

    for(let i = 0; i<dictionary.length; i++){
      if(dictionary[i]){
        insert(root, dictionary[i]);
      }
    }

    //Create the grid for the visited
    for(let row = 0; row < grid.length; row++){
      visited[row] = new Array(grid[0].length)
      for (let col = 0; col < grid[0].length; col++){
        visited[row].push('0');
      }
    }

    let word = '';
    let words = new Set();

    //Go to every node in the grid
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++){
        //Solve for this node as a root
          findWords(row, col, grid, dictionary, visited, word, root, words);
      }
    }
    return Array.from(words).sort();
  }else{
    return([]);
  }
}

//exports.findAllSolutions = solver;
export default solver;
