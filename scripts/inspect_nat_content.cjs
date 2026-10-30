async function inspectNat() {
  const res = await fetch('https://careerdost.blog/api/articles/nts-nat-xi-2026-november-registration-guide');
  const d = await res.json();
  const content = d.data.content;
  console.log('Total content sections:', content.length);
  for (let i = 0; i < content.length; i++) {
    console.log(`\n=== SECTION ${i+1} ===`);
    console.log(content[i]);
  }
}
inspectNat().catch(console.error);
