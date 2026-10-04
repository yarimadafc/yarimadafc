#!/bin/bash

# Fix xeberler/[id]/page.tsx
sed -i '' 's/export default function EditNews({ params }: { params: { id: string } }) {/import { use } from "react";\n\nexport default function EditNews({ params }: { params: Promise<{ id: string }> }) {\n  const resolvedParams = use(params);/g' src/app/adminpanel/xeberler/[id]/page.tsx
sed -i '' 's/params.id/resolvedParams.id/g' src/app/adminpanel/xeberler/[id]/page.tsx

# Fix komandalar/[id]/page.tsx
sed -i '' 's/export default function EditTeam({ params }: { params: { id: string } }) {/import { use } from "react";\n\nexport default function EditTeam({ params }: { params: Promise<{ id: string }> }) {\n  const resolvedParams = use(params);/g' src/app/adminpanel/komandalar/[id]/page.tsx
sed -i '' 's/params.id/resolvedParams.id/g' src/app/adminpanel/komandalar/[id]/page.tsx

