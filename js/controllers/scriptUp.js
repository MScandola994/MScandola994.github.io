app.controller('scriptUpController', function ($scope, $state, $http) {
    $scope.istanze = [];
    $scope.db = [];
    $scope.autori = [];

    $scope.getIstanze = function () {
        $http.get("../extLib/json-test/script-istanze.json").success(function (data) {
            $scope.istanze = data;
        });
    };

    $scope.getDB = function (istanza) {
        $http.get("../extLib/json-test/script-db.json").success(function (data) {
            $scope.db = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].istanza == istanza) $scope.db.push(data[i].nome);
            }
        });
    };

    $scope.getAutori = function (db) {
        $http.get("../extLib/json-test/script-autori.json").success(function (data) {
            $scope.autori = data
        });
    };


    $scope.getIstanze();
    $scope.$watch('search.istanza', function (v) {
        if (!v) return
        $scope.getDB(v);
    });
    $scope.$watch('search.db', function (v) {
        if (!v) return
        $scope.getAutori(v);
    });


    $scope.isTableRendered = false;
    var copyArray = [];

    $scope.search = {
        istanza: null,
        db: null,
        filter: '',
        scripted: '',
        periodo: null,
        autore: null,
    };

    //questo può essere usato per una ricerca sui risultati del primo filtraggio e quindi non serve tenerlo memorizzato
    $scope.tableSearch = '';
    var searchRegex;
    var escapeRegex = /[\-\[\]{}()*+?.,\\\^$|#\s]/g;
    var wordRegex = /[\w\u00C0-\u017F\u1e00-\u1ef9]+/gi;


    $scope.resetSearch = function (allSearch) {
        //pulisco tutto tranne l'istanza
        if (allSearch) $scope.search.db = null;
        $scope.search.filter = null;
        $scope.search.periodo = null;
        $scope.search.autore = null;
        $scope.search.scripted = '';
    };

    var genPeriods = function (numDays) {
        var d = new Date();
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
        d.setDate(d.getDate() - numDays);
        return d;
    };
    $scope.periodi = [{
        label: 'Oggi',
        value: new Date()
    }, {
        label: 'Ultima Settimana',
        value: genPeriods(7)
    }, {
        label: 'Ultime Due Settimane',
        value: genPeriods(14)
    }, {
        label: 'Ultimo Mese',
        value: genPeriods(30)
    }, {
        label: 'Ultimi Tre Mesi',
        value: genPeriods(90)
    }, {
        label: 'Ultimi Sei Mesi',
        value: genPeriods(180)
    }, {
        label: 'Tutti',
        value: 'all'
    }];

    $scope.showFilter = false;
    $scope.toggleFilter = function () {
        $scope.showFilter = !$scope.showFilter;
        //se vado a nascondere i filtri ... resetto i campi
        if (!$scope.showFilter) {
            $scope.resetSearch(false);
        }
    };

    $scope.carrello = [];

    $scope.clearCart = function (elm) {
        var cartCopy = [];
        for (var i = 0; i < $scope.carrello.length; i++) {
            if (elm.id != $scope.carrello[i].value.id) cartCopy.push($scope.carrello[i]);
        }
        $scope.carrello = cartCopy;
    };

    $scope.checkCart = function () {
        for (var i = 0; i < $scope.filteredArray.length; i++) {
            for (var j = 0; j < $scope.carrello.length; j++) {
                if ($scope.carrello[j].value.id == $scope.filteredArray[i].id) {
                    $scope.filteredArray[i].inCart = true;
                }
            }
        }
    };

    $scope.cart = function (elm) {
        for (var i = 0; i < $scope.filteredArray.length; i++) {
            if ($scope.filteredArray[i].id == elm.id) {
                if ($scope.filteredArray[i].inCart == false) {
                    $scope.filteredArray[i].inCart = true;
                    $scope.carrello.push({
                        info: searchCopy,
                        value: $scope.filteredArray[i]
                    });
                } else {
                    $scope.filteredArray[i].inCart = false;
                    $scope.clearCart(elm);
                }
            }
        }
    };

    $scope.modalParams = {
        title: '',
        body: ''
    }
    $scope.openModale = function ($event, es) {
        $event.stopPropagation();
        $scope.modalParams.title = es.nome;
        $scope.modalParams.body = 'CREATE TABLE "topic" ( "id" serial NOT NULL PRIMARY KEY, "forum_id" integer NOT NULL, "subject" varchar(255) NOT NULL ); ALTER TABLE "topic" ADD CONSTRAINT forum_id FOREIGN KEY ("forum_id") REFERENCES "forum" ("id"); /* Initials */ insert into "topic" ("forum_id", "subject") values (2, \'D\'\'artagnian\');';

        $scope.modalParams.body = $scope.modalParams.body.replace(/(;|(\/\*[\w\'\s\r\n\*]*\*\/)|(\/\/[\w\s\']*)|(\<![\-\-\s\w\>\/]*\>))/g, '$1' + '<br>');

        window.setTimeout(function () {
            $('pre code').each(function (i, block) {
                hljs.highlightBlock(block);
            });
        }, 1);


        $('#modal-trigger').click();
    };


    $scope.tableConfig = {
        ids: ['id', 'nome', 'tipo', 'autore', 'dataInserimento', 'schema', 'scripted'],
        labels: ['#', 'Nome', 'Tipo', 'Autore', 'Data Inserimento', 'Schema', 'Scriptato']
    };

    $scope.elencoScript = [];

    $scope.startSearch = function () {
        //filtro con i parametri e creo l'elenco globale
        var dIns;
        var obj = {};
        $scope.isTableRendered = false;
        $scope.elencoScript = [];
        $scope.tableSearch = '';
        $http.get("../extLib/json-test/script-oggetti.json").success(function (data) {
            for (var i = 0; i < data.length; i++) {

                if ($scope.search.istanza != data[i].istanza) continue;
                if ($scope.search.db != data[i].db) continue;

                if (($scope.search.autore) && $scope.search.autore != data[i].autore) continue;
                dIns = new Date(data[i].dataInserimento);
                if ($scope.search.periodo && ($scope.search.periodo.value && $scope.search.periodo.value != 'all')) {
                    if ($scope.search.periodo.value > dIns) continue;
                }

                if ($scope.search.scripted == 'true' || $scope.search.scripted == 'false') {
                    if ((data[i].scripted + "") != $scope.search.scripted) continue;
                }

                obj = {};

                for (var j in $scope.tableConfig.ids) {
                    obj[$scope.tableConfig.ids[j]] = data[i][$scope.tableConfig.ids[j]];
                    //gestione del fatto che sia presente nel carrello
                    obj.inCart = false;
                    obj.dataInserimento = dIns;
                    //cerco in tutti gli oggetti del carrello
                    for (var c = 0; c < $scope.carrello.length; c++) {
                        if ($scope.carrello[c].value.id == obj.id) {
                            obj.inCart = true;
                            break;
                        }
                    }
                    obj.forFilter = obj.nome + obj.tipo + obj.autore + obj.schema + obj.dataInserimento + obj.id;

                }
                $scope.elencoScript.push(obj);

            }

            //renderizzo con filtro della tabella e imposto l'impaginazione
            $scope.getFilteredScripts(true);

            //dopo il for creo un salvataggio dei parametri utilizzati ... in modo tale da utilizzarli per altre chiamate
            searchCopy = $scope.search;
            $scope.isTableRendered = true;
        });
    };

    $scope.filteredArray = [];
    $scope.pagination = {
        min: 0,
        max: 0,
        current: 0,
        rowForPage: 10,
        page: [],
        pages: [],
    };

    $scope.setPagination = function (numPag, reverse) {
        var maxPagesDiff = 4;

        $scope.pagination.pages = [];

        if (!reverse) {
            $scope.pagination.min = numPag;
            $scope.pagination.current = numPag;
            $scope.pagination.max = Math.floor($scope.filteredArray.length / $scope.pagination.rowForPage);
            //se la divisione non da resto devo decrementare max di un valore
        } else {
            $scope.pagination.current = numPag + 1;
            $scope.pagination.min = Math.max(0, $scope.pagination.current - maxPagesDiff);
        }

        if (Math.floor($scope.filteredArray.length % $scope.pagination.rowForPage) == 0) $scope.pagination.max--;


        if (!reverse) {
            for (var i = numPag; i <= Math.min($scope.pagination.max, numPag + maxPagesDiff); i++) {
                $scope.pagination.pages[i - numPag] = {
                    label: i + 1,
                    value: i
                }
            }
        } else {
            for (var i = $scope.pagination.current; i >= $scope.pagination.min; i--) {
                $scope.pagination.pages[i - $scope.pagination.min] = {
                    label: i + 1,
                    value: i
                }
            }
        }
    };

    $scope.genPage = function (pag) {
        if ($scope.pagination.max == -1) {
            $scope.pagination.pages = [];
            $scope.pagination.page = [];
        }
        if (pag > $scope.pagination.max || pag < 0) return;

        if (pag == $scope.pagination.pages[$scope.pagination.pages.length - 1].value && pag != $scope.pagination.max) $scope.setPagination(pag, false);

        if (pag && pag < $scope.pagination.min) $scope.setPagination(pag, true);

        $scope.pagination.page = [];
        for (var i = (pag * $scope.pagination.rowForPage); i < (pag * $scope.pagination.rowForPage) + $scope.pagination.rowForPage; i++) {
            $scope.pagination.page.push($scope.filteredArray[i]);
            if (i == $scope.filteredArray.length - 1) break;
        };

        $scope.pagination.current = pag;

    };


    $scope.getFilteredScripts = function (firstRun) {
        $scope.filteredArray = [];
        if (!searchRegex || firstRun) {
            $scope.filteredArray = angular.copy($scope.elencoScript);
        } else {
            for (var i = 0; i < $scope.elencoScript.length; i++) {
                if (searchRegex.test($scope.elencoScript[i].forFilter)) $scope.filteredArray.push($scope.elencoScript[i]);
            }
        }
        $scope.checkCart();
        //vado ad impostare l'impaginazione
        $scope.setPagination(0, false);
        $scope.genPage(0);
    };

    $scope.$watch('tableSearch', function (v) {
        var searchFilter = v.trim();
        if (searchFilter.length < 2 || !$scope.elencoScript.length) {
            searchRegex = null;
            if (searchFilter.length < 2) {
                $scope.filteredArray = angular.copy($scope.elencoScript);
                $scope.checkCart();
                $scope.setPagination(0, false);
                $scope.genPage(0);
            }
            return;
        } else {
            var i, k;
            // escape every word
            var words = searchFilter.match(wordRegex);
            if (!words || !words.length) return;

            for (i = 0; i < words.length; i++) {
                words[i] = words[i].replace(escapeRegex, "\\$&");
            }
            // add escaped words to our new search regex
            searchRegex = new RegExp('^(?=.*' + words.join(')(?=.*') + ')', 'mgi');
        }
        $scope.getFilteredScripts(false)
    });


});