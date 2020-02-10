$(document).ready(function(){
	
	var url = "https://api.github.com/users/";
		client_id = "7774d34a9803aa01523b";
		client_secret = "c04d44393977fc8bcc1924ec047d770535c7f7cf";
		search = $('#search-form');
		profile_html = $('#profile');
		content = $('#content');

		//Objetos de parâmetros das listagens
		repos = {
			title: 'Repositórios', //Título da listagem
			url: 'repos', //Url do endpoit
			btn_id: 'repos_btn', //Id do botão de listagem
			show_author: false //Exibir autor do reposítório na listagem
		}
		starred = {
			title: 'Favoritos',
			url: 'starred',
			btn_id: 'fav_btn',
			show_author: true
		}

		search.submit(function(e){
			var user = (e.target.search.value)

			content.empty();

			$.ajax({
				url: url+user,
				data: {
					client_id: client_id,
					client_secret: client_secret
				}
			}).done(function(data){
				showProfile(data);

				$('#'+repos.btn_id).click(function(){
					showList(data, repos);
				})

				$('#'+starred.btn_id).click(function(){
					showList(data, starred);
				})
			}).fail(function(data){
				console.log(data);
				if (data.status == 404) {
					profile_html.html(`
						<span class="text-danger">O usuário <strong>${user}</strong> não foi encontrado<span>
					`);
				}
				else {
					profile_html.html(`
						<span class="text-danger">ERRO: ${data.statusText}<span>
					`);
				}
			});


			e.preventDefault();
		});

		//Exibe o perfil pesquisado
		function showProfile(user){
			profile_html.html(`
				<div class="row">
					<div class="col-lg-3 col-sm-4 mb-4 mb-sm-0 avatar-block">
						<img class="mb-2" src="${user.avatar_url}" />
						<a class="btn btn-block btn-dark btn-sm" href="${user.html_url}" target="_blank">Ver no GitHub</a>
						<button type="button" id="${repos.btn_id}" class="btn btn-block btn-primary">Listar Repositórios</button>
						<button type="button" id="${starred.btn_id}" class="btn btn-block btn-primary">Listar Favoritos</button>
					</div>
					<div class="col-12 col-sm text-center text-sm-left">
						<h3 class="mb-1">${(user.name) ? user.name : user.login}</h3>
						<h4 class="text-secondary h6 pl-1">${user.login}</h4>
						<div class="mb-4">
							<a class="badge text-body hover-secondary" href="${user.html_url}/repositories" target="_blank"><i class="far fa-folder-open"></i> Repositórios <span class="badge badge-secondary">${user.public_repos}</span> </a>
							<a class="badge text-body hover-secondary" href="${user.html_url}/followers" target="_blank"><i class="fas fa-users"></i> Seguidores <span class="badge badge-secondary">${user.followers}</span> </a>
							<a class="badge text-body hover-secondary" href="${user.html_url}/following" target="_blank"><i class="fas fa-user-friends"></i> Seguindo <span class="badge badge-secondary">${user.following}</span> </a>
						</div>
					</div>
				</div>
			`);
		}

		//Exibe a listagem selecionada
		function showList(user, endpoint){
			$.ajax({
				url: url+user.login+'/'+endpoint.url,
				data: {
					client_id: client_id,
					client_secret: client_secret
				}
			}).done(function(data){
				//Card onde a lista será exibida
				content.html(`
					<div class="card text-center text-sm-left">
						<h5 class="card-header">${endpoint.title} de ${(user.name) ? user.name : user.login}</h5>
						<div class="card-body">
							<ul id="list" class="list-group"></ul>
						</div>
					</div>
				`);
				//Listagem dos itens
				if (data.length) {
					$.each(data, function(i, x){
						$('#list').append(`
							<div class="list-group-item">
								<div class="row align-items-center">
									<div class="col-md-8 col-lg-9">
										<h6 class="h5">
											${(endpoint.show_author) ? '<span class="h6 text-secondary">'+x.owner.login+'/</span>' : ''} ${x.name}
										</h6>
										<p>${(x.description) ? x.description : "&nbsp"}</p>
									</div>
									<div class="col text-md-right">
										<a class="btn btn-dark btn-md-block" href="${x.html_url}" target="_blank">Abrir Repositório</a>
									</div>
								</div>
							</div>
						`);
					})
					//Se a lista for maior que 29 itens, exibe link do perfil completo no final
					if (data.length > 29) {
						$('#list').append(`
							<a class="btn btn-block list-group-item bg-primary text-white" href="${user.html_url}" target="_blank">Ver Todos</a>
						`)
					}
				}
				//Mensagem exibida caso a lista não possua itens
				else {
					$('#list').append(`
						<span class="text-secondary">O usuário não possui ${endpoint.title}<span>
					`)
				}
			});
		}
});