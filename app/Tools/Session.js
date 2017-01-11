module.exports={

	// Création d'un token d'aide à la personne
	function Session()
	{
		var date = new Date();
		var myId = "";
		var session;

		/**
		 * Création de l'objet JSON de session
		 * @param  {[type]} beacon_id   [description]
		 * @param  {[type]} beacon_name [description]
		 * @param  {[type]} position    [description]
		 * @param  {[type]} name        [description]
		 * @param  {[type]} sex         [description]
		 * @return {[type]}             [description]
		 */
		this.create = function(beacon_id, beacon_name, position, name, sex)
		{

		}

		this.getSession = function()
		{
			return this.session;
		}
	}
};
