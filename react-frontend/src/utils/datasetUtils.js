export const searchTrees = (trees, searchTerm) => {
    return trees.filter(tree =>
      tree.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tree.englishName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  export const filterTreesByLocation = (trees, location) => {
    if (location === 'all') return trees;
    return trees.filter(tree => tree.location === location);
  };
  