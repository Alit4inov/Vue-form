export default () => {
    'use strict';

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
            btn_text: 'Next'
        },
        methods: {
            setToStorage() {
                console.log(this.persons);
                this.persons.push(Object.assign({}, this.personalInfo));
                this.savePersonsToStorage();
                for (let key in this.personalInfo) {
                    this.personalInfo[key] = '';
                }
                this.$validator.reset();
                this.stage = 0;
                this.textChange();
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
            },
            stepSwitch() {
                this.$validator.validateAll('registration').then((success) => {
                    if (success && this.stage === 0) {
                        ++this.stage;
                    }else if (success && this.stage >= 1) {
                        --this.stage;
                    }
                    this.textChange();
                });
            },
            textChange() {
                if (this.stage === 0 ){
                    this.btn_text = 'Next';
                }else {
                    this.btn_text = 'Back';
                }
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