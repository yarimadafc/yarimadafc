const fs = require('fs');

function applyTranslation(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Add import
  if (!content.includes('autoTranslateFields')) {
    content = content.replace(/import \{ supabase \} from '@\/lib\/supabase';/, `import { supabase } from '@/lib/supabase';\nimport { autoTranslateFields } from '@/lib/autoTranslate';`);
  }

  // Inject translation into handleSubmit
  const oldHandleSubmit = `e.preventDefault();
    setLoading(true);
    const slug = generateSlug(formData.title_az);`;

  const newHandleSubmit = `e.preventDefault();
    setLoading(true);
    
    // Auto translate missing fields
    const { updatedData } = await autoTranslateFields(formData, ['title', 'content', 'excerpt']);
    const slug = generateSlug(updatedData.title_az);
    
    // Replace formData reference with updatedData for the insert/update
    const dataToSave = { ...updatedData, slug };`;

  content = content.replace(oldHandleSubmit, newHandleSubmit);
  
  // Now replace formData with dataToSave in the insert/update call
  if (content.includes('.insert([formData])')) {
    content = content.replace(/\.insert\(\[\{ \.\.\.formData, slug \}\]\)/, '.insert([dataToSave])');
    content = content.replace(/\.insert\(\[formData\]\)/, '.insert([dataToSave])');
  } else {
    // update call
    content = content.replace(/\.update\(formData\)/, '.update(dataToSave)');
  }

  fs.writeFileSync(file, content, 'utf8');
}

applyTranslation('src/app/adminpanel/xeberler/yeni/page.tsx');
applyTranslation('src/app/adminpanel/xeberler/[id]/page.tsx');
console.log('Xeberler translations added');
