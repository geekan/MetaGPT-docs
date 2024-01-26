import { resolve, join } from 'node:path';
import fs from 'node:fs';

export const tree = (dir, base = '', filter = ['.md']) => {
  if (!fs.existsSync(dir)) {
    return;
  }
  const paths = fs.readdirSync(dir);

  const d = paths
    .map((_) => {
      const p = join(dir, _);
      const stat = fs.statSync(p);
      if (stat.isDirectory()) {
        return {
          text: _,
          items: tree(p, base, filter),
        };
      }
      if (!filter.every((_) => p.endsWith(_))) {
        return null;
      }
      return { text: _.replace('.md', ''), link: p.replace(base, '') };
    })
    .filter((_) => _);

  return d;
};
