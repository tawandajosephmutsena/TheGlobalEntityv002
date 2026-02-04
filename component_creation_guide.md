# Developer Guide: Building & Uploading Custom Blocks

This guide walks you through creating a new React component, packaging it as a plugin, and using the **Plugin Manager** to install it.

## 🏗️ The 3-File Architecture

To create a block named **"My New Block"**, you need to create three files:

1. **The UI Component** (`resources/js/components/ui/MyComponent.tsx`): The pure visual code.
2. **The Block Wrapper** (`resources/js/components/Blocks/MyBlock.tsx`): Connects data to the UI.
3. **The Editor** (`resources/js/components/admin/PageBuilder/editors/MyEditor.tsx`): The admin settings panel.

---

## 🛠️ Step 1: Create the Component Locally

On your computer, create your component files following the existing structure.

### Example: Simple Header Block

**Block Wrapper (`MyBlock.tsx`)**:

```tsx
export default function MyBlock({ title, color }) {
    return <h2 style={{ color }}>{title}</h2>;
}
```

---

## 📦 Step 2: Register & Build (Crucial Step)

Because React code must be "compiled" into a format browsers understand, you cannot simply upload a `.tsx` file via the browser and expect it to work.

1. **Register it**: Add your block configuration to `resources/js/lib/registerBlocks.tsx`.
2. **Run Build**: In your terminal, run:
   ```bash
   npm run build
   ```
   This creates the compiled JavaScript in the `public/build/` folder.

---

## 📤 Step 3: Using the "Plugin Manager" (Upload)

The **Plugin Manager** in your Admin Panel is used to track and manage these modules.

1. **Zip your code**: Create a `.zip` file containing your new component files (for backup/distribution).
2. **Upload**:
   - Go to **Admin Hub > Plugins > Component Importer**.
   - Drag your `.zip` into the box.
   - Click **"Register Plugin"**.
3. **Sync Build**: Upload the **entire** locally generated `public/build/` folder to your cPanel `public_html/build/`.

---

## 🎯 Step 4: Use it in Page Builder

1. Navigate to **Pages** in the Admin panel.
2. Click **"Edit"** on any page.
3. Click **"Add Section"**.
4. Your new component will appear in the list with the icon you chose in `registerBlocks.tsx`.

---

## ❓ FAQ & Troubleshooting

**Q: I uploaded the ZIP but the block doesn't show up.**
**A:** Ensure you uploaded the `public/build/` folder from your computer after running `npm run build`. The ZIP is for tracking, but the browser only sees the code in the `build` folder.

**Q: Can I share my components with other people?**
**A:** Yes! Give them your ZIP and they can upload it via their Plugin Manager, then add the registration line to their `registerBlocks.tsx`.
