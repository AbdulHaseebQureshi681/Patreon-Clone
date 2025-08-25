export function toReactCommentsTree(apiComments = []) {
    // 1) flat -> node shape
    const nodes = apiComments.map(c => ({
      comId: c.comId || String(c._id),
      userId: c.user?._id || 'unknown',
      fullName: c.user?.name || 'User',
      avatarUrl: c.user?.image || 'https://picsum.photos/200',
      userProfile: c.user?.image || 'https://picsum.photos/200',
      text: c.text,
      createdAt: c.createdAt,
      replies: [
        
      ],
      parentComId: c.parentComId || null,
    }));
  
    // 2) index and attach
    const byId = new Map(nodes.map(n => [n.comId, n]));
    const roots = [];
    for (const n of nodes) {
      if (n.parentComId && byId.has(n.parentComId)) {
        byId.get(n.parentComId).replies.push(n);
      } else {
        roots.push(n);
      }
    }
    return roots;
  }