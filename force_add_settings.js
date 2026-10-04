const fs = require('fs');

function addSettings(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('const [settings, setSettings]')) {
    const hookLine = `  const t = useTranslations();`;
    const newHook = `  const t = useTranslations();\n  const [settings, setSettings] = useState<any>(null);\n  useEffect(() => {\n    supabase.from('site_settings').select('*').single().then(({ data }) => {\n      if (data) setSettings(data);\n    });\n  }, []);`;
    content = content.replace(hookLine, newHook);
  }
  fs.writeFileSync(file, content, 'utf8');
}

addSettings('src/components/Footer.tsx');
addSettings('src/components/Navbar.tsx');
