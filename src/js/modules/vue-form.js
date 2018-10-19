// This is an examples of simple export.
//
// You can remove or add your own function in this file.

export default () => {
    'use strict';

    const async = () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), 0);
        });
    };

    VeeValidate.Validator.extend('nickname', {

        getMessage: (field, [args], data) => {
            return (data && data.message) || 'Something went wrong';
        },
        validate: (value, [args]) => {
            
            const keywords = [
                'god',
                'devil',
                'president'
            ];

            let status = true;

            keywords.forEach(function(el) {
                if (value === el) {
                    status = false;
                }
            });

            return new Promise((resolve) => {
                resolve({
                    valid: status,
                    data: status ? undefined : { message: 'nickname must not be a:' + JSON.stringify(keywords) }
                });
            });

        }
    });


    Vue.use(VeeValidate);


    new Vue({
        el: '#wrapper',
        data: {
            stage: 0,
            personalInfo: {
                firstName: '',
                lastName: '',
                email: '',
                age: '',
                skype: '',
                hobbies: '',
                telephones: '',
                nickname: '',
            },
            persons: [],
            btnDisable: true
        },
        watch: {
            personalInfo: {
                handler(val, oldVal) {

                    let status = false,
                        n = 0;

                    for (let key in val) {
                        if (val[key]) {
                            n++;
                        }
                    }

                    this.$validator.validateAll('registration').then((success) => {

                        if (success) {
                            status = true;
                        }

                        async().then(() => {
                            if (n >= 5 && status === true) {
                                this.stage = 1;
                                this.btnDisable = false;
                            }else {
                                this.stage = 0;
                                this.btnDisable = true;
                            }
                        });

                    });
                },
                deep: true
            },
            
        },
        methods: {
            storageAvailable(type) {
                try {
                    let storage = window[type],
                        x = '__storage_test__';
                    storage.setItem(x, x);
                    storage.removeItem(x);
                    return true;
                } catch (e) {
                    return false;
                }
            },
            setToStorage() {
                if (this.storageAvailable('localStorage')) {
                    async().then(() => {
                        this.persons.push(Object.assign({}, this.personalInfo));
                        this.savePersonsToStorage();
                        return this.getFromStorage();
                    }).then(() => {
                        for (let key in this.personalInfo) {
                            this.personalInfo[key] = '';
                        }
                    }).then(() => {
                        setTimeout(() => {
                            this.errors.clear('registration');
                        }, 100);
                    });
                } else {
                    console.log('local storage not available');
                }
            },
            getFromStorage() {
                this.persons = JSON.parse(localStorage.getItem('persons'));
            },
            clearLocalStorage() {
                localStorage.clear();
                alert('local storage cleaned');
            },
            removePerson(index) {
                this.persons.splice(index, 1);
                this.savePersonsToStorage();
            },
            savePersonsToStorage() {
                localStorage.persons = JSON.stringify(this.persons);
            }
        },
        created() {
            if (localStorage.length) {
                this.getFromStorage();
            } else {
                alert('no data in local storage');
            }
        }
    });
};