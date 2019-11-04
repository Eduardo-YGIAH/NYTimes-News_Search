const form = document.querySelector('.form');
let startYear = form.querySelector('#start_year');
let endYear = form.querySelector('#end_year');
let numRecordsInput = form.querySelector('#num_records');
let searchTermInput = form.querySelector('#search_term');
let searchTerm = '';
let buttons = form.querySelectorAll('.button');

let beginDate = '';
let endDate = '';
let numRecords = `&page=${numRecordsInput.value}`;

startYear.addEventListener('keyup', e => {
	if (!/^(19|20)\d\d$/.test(startYear.value)) {
		startYear.style.color = 'crimson';
		startYear.style.boxShadow = '0 0 5px crimson';
		beginDate = '';
	} else {
		startYear.style.color = 'limegreen';
		startYear.style.boxShadow = '0 0 5px limegreen';
		beginDate = `begin_date=${startYear.value}0101`;
	}
});
endYear.addEventListener('keyup', e => {
	if (
		!/^(19|20)\d\d$/.test(endYear.value) ||
		endYear.value <= startYear.value
	) {
		endYear.style.color = 'crimson';
		endYear.style.boxShadow = '0 0 5px crimson';
		endDate = '';
	} else {
		endYear.style.color = 'limegreen';
		endYear.style.boxShadow = '0 0 5px limegreen';
		endDate = `&end_date=${endYear.value}0101`;
	}
});

searchTermInput.addEventListener('keyup', () => {
	searchTerm = searchTermInput.value;
	if (searchTerm.length > 2) {
		buttons[0].classList.remove('inactive');
		buttons[0].disabled = false;
		buttons[0].classList.add('active');
	} else {
		buttons[0].classList.remove('active');
		buttons[0].classList.add('inactive');
		buttons[0].disabled = true;
	}
});

form.addEventListener('submit', e => {
	e.preventDefault();
	searchTerm = searchTermInput.value;
	let queryUrl =
		'https://api.nytimes.com/svc/search/v2/articlesearch.json?' +
		beginDate +
		endDate +
		numRecords +
		'&fq=source:("The New York Times")' +
		'&q=' +
		searchTerm +
		'&sort=relevance' +
		'&api-key=R1a31F4tBjCUaM2ho8GtIFsrSdtXt30M';

	let fragment = document.createDocumentFragment();

	fetch(queryUrl)
		.then(response => response.json())
		.then(data => {
			const dataArray = data.response.docs;
			console.log(dataArray);

			dataArray.forEach(el => {
				// console.log(el.headline.main);
				// console.log(el.snippet);
				// console.log(el.multimedia[19].url);

				const articlesList = document.querySelector('.articles_list');
				const article = document.createElement('li');
				const linkTo = document.createElement('a');
				const articleContainer = document.createElement('div');
				const articleHeading = document.createElement('h2');
				const articleSnipet = document.createElement('p');
				const pubDate = document.createElement('p');
				const articleThumbnail = document.createElement('img');

				articleHeading.textContent = el.headline.main;
				articleSnipet.textContent = el.snippet;
				pubDate.textContent =
					'Published on: ' + el.pub_date.substr(0, 10);

				linkTo.setAttribute('href', el.web_url);

				linkTo.style.textDecoration = 'none';
				linkTo.style.color = 'black';

				article.classList.add('article');
				articleContainer.classList.add('article_container');
				articleThumbnail.classList.add('thumbnail');
				pubDate.classList.add('pub_date');

				if (el.multimedia[19]) {
					articleThumbnail.setAttribute(
						'src',
						`https://nytimes.com/${el.multimedia[19].url}`,
					);
					articleContainer.appendChild(articleThumbnail);
				}
				articleContainer.appendChild(articleHeading);
				articleContainer.appendChild(pubDate);
				articleContainer.appendChild(articleSnipet);

				linkTo.appendChild(articleContainer);

				article.appendChild(linkTo);

				fragment.appendChild(article);

				articlesList.appendChild(fragment);

				buttons[0].classList.remove('active');
				buttons[0].classList.add('inactive');
				buttons[0].disabled = true;

				buttons[1].classList.remove('inactive');
				buttons[1].disabled = false;
				buttons[1].classList.add('active');

				buttons[1].addEventListener('click', () => {
					articlesList.innerHTML = '';

					buttons[1].classList.remove('active');
					buttons[1].classList.add('inactive');
				});
			});
		});
});
