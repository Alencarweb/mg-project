// ... existing code ...
<Link
  href="/admin/steps"
  className={`flex items-center space-x-2 py-2 px-4 rounded-lg ${
    pathname === '/admin/steps' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
  }`}
>
  <ListChecks size={20} />
  <span>Etapas</span>
</Link>
// ... existing code ...