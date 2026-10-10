(() => {
  const query = new URLSearchParams(location.search);
  if (query.get('from') !== 'project') return;
  const projectQuery = new URLSearchParams();
  for (const key of ['project', 'name']) {
    if (query.has(key)) projectQuery.set(key, query.get(key));
  }
  const destination = '01A-项目明细.html?' + projectQuery.toString();
  const breadcrumb = document.querySelector('.detail-breadcrumb');
  const parent = breadcrumb.querySelector('a:not(.detail-back)');
  parent.textContent = '项目详情';
  parent.href = destination;
  breadcrumb.querySelector('.detail-back').href = destination;
  document.querySelectorAll('.sidebar .item').forEach(item => {
    item.classList.toggle('active', item.getAttribute('href') === '01-项目统计首页.html');
  });
})();
