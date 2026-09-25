const fs = require('fs');
const file = 'src/components/survey/SurveyContainer.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/rgba\(10, 15, 12, 0\.75\)/g, "'var(--paper)'");
c = c.replace(/rgba\(10,15,12,0\.75\)/g, "'var(--paper)'");
c = c.replace(/var\(--mint\)/g, 'var(--void)');
c = c.replace(/rgba\(201, 246, 221, 0\.14\)/g, 'rgba(6, 54, 42, 0.08)');
c = c.replace(/var\(--paper\)/g, 'var(--emerald)'); // Headers were paper, make them emerald

fs.writeFileSync(file, c);
console.log('Update complete');
