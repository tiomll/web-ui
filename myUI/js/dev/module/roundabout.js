define(function(require, exports, module) {
	var defaults, internalData, methods;

	$.extend({
		roundaboutShapes: {
			def: "lazySusan",
			lazySusan: function(r, a, t) {
				return {
					x: Math.sin(r + a),
					y: (Math.sin(r + 3 * Math.PI / 2 + a) / 8) * t,
					z: (Math.cos(r + a) + 1) / 2,
					scale: (Math.sin(r + Math.PI / 2 + a) / 2) + 0.5
				};
			}
		}
	});

	defaults = {
		bearing: 0.0,
		tilt: 0.0,
		minZ: 100,
		maxZ: 280,
		minOpacity: 0.4,
		maxOpacity: 1.0,
		minScale: 0.4,
		maxScale: 1.0,
		duration: 600,
		btnNext: null,
		btnNextCallback: function() {},
		btnPrev: null,
		btnPrevCallback: function() {},
		btnToggleAutoplay: null,
		btnStartAutoplay: null,
		btnStopAutoplay: null,
		easing: "swing",
		clickToFocus: true,
		clickToFocusCallback: function() {},
		focusBearing: 0.0,
		shape: "lazySusan",
		debug: false,
		childSelector: "li",
		startingChild: null,
		reflect: false,
		floatComparisonThreshold: 0.001,
		autoplay: false,
		autoplayDuration: 1000,
		autoplayPauseOnHover: false,
		autoplayCallback: function() {},
		enableDrag: false,
		dropDuration: 600,
		dropEasing: "swing",
		dropAnimateTo: "nearest",
		dropCallback: function() {},
		dragAxis: "x",
		dragFactor: 4,
		triggerFocusEvents: true,
		triggerBlurEvents: true,
		responsive: false
	};

	internalData = {
		autoplayInterval: null,
		autoplayIsRunning: false,
		animating: false,
		childInFocus: -1,
		touchMoveStartPosition: null,
		stopAnimation: false,
		lastAnimationStep: false
	};

	methods = {
		// 初始化
		init: function(options, callback, relayout) {
			var settings, now = (new Date()).getTime();

			options = (typeof options === "object") ? options : {};
			callback = ($.isFunction(callback)) ? callback : function() {};
			callback = ($.isFunction(options)) ? options : callback;
			settings = $.extend({}, defaults, options, internalData);

			return this.each(function() {
				var _this = $(this),
					childCount = _this.children(settings.childSelector).length,
					period = 360.0 / childCount,
					startingChild = (settings.startingChild && settings.startingChild > (childCount - 1)) ? (childCount - 1) : settings.startingChild,
					startBearing = (settings.startingChild === null) ? settings.bearing : 360 - (startingChild * period),
					holderCSSPosition = (_this.css("position") !== "static") ? _this.css("position") : "relative";

				_this.css({padding: 0, position: holderCSSPosition}).data("roundabout", $.extend({}, settings, {
					startingChild: startingChild,
					bearing: startBearing,
					oppositeOfFocusBearing: methods.normalize.apply(null, [settings.focusBearing - 180]),
					dragBearing: startBearing,
					period: period
				}));

				// 如果不是重新布局就不不调用
				if (!relayout) {
					// 当前项点击事件绑定
					if (settings.clickToFocus) {
						_this.children(settings.childSelector).each(function(i) {
							$(this).on("click.roundabout", function() {
								var degrees = methods.getPlacement.apply(_this, [i]);
								if (!methods.isInFocus.apply(_this, [degrees])) {
									methods.stopAnimation.apply($(this));
									if (!_this.data("roundabout").animating) {
										methods.animateBearingToFocus.apply(_this, [degrees, _this.data("roundabout").clickToFocusCallback]);
									}
									return false;
								}
							});
						});
					}
					// 下一项按钮
					if (settings.btnNext) {
						$(settings.btnNext).on("click.roundabout", function() {
							if (!_this.data("roundabout").animating) {
								methods.animateToNextChild.apply(_this, [_this.data("roundabout").btnNextCallback]);
							}
							return false;
						});
					}
					// 上一项按钮
					if (settings.btnPrev) {
						$(settings.btnPrev).on("click.roundabout", function() {
							methods.animateToPreviousChild.apply(_this, [_this.data("roundabout").btnPrevCallback]);
							return false;
						});
					}
					// 自动切换按钮
					if (settings.btnToggleAutoplay) {
						$(settings.btnToggleAutoplay).on("click.roundabout", function() {
							methods.toggleAutoplay.apply(_this);
							return false;
						});
					}
					// 开始自动切换按钮
					if (settings.btnStartAutoplay) {
						$(settings.btnStartAutoplay).on("click.roundabout", function() {
							methods.startAutoplay.apply(_this);
							return false;
						});
					}
					// 停止自动切换按钮
					if (settings.btnStopAutoplay) {
						$(settings.btnStopAutoplay).on("click.roundabout", function() {
							methods.stopAutoplay.apply(_this);
							return false;
						});
					}
					// 自动切换时鼠标经过停止
					if (settings.autoplayPauseOnHover) {
						_this.on("mouseenter.roundabout.autoplay", function() {
							methods.stopAutoplay.apply(_this, [true]);
						}).on("mouseleave.roundabout.autoplay", function() {
							methods.startAutoplay.apply(_this);
						});
					}
					// 拖拽
					if (settings.enableDrag) {
						// on screen
						if (!$.isFunction(_this.drag)) {
							if (settings.debug) {
								alert("You do not have the drag plugin loaded.");
							}
						} else if (!$.isFunction(_this.drop)) {
							if (settings.debug) {
								alert("You do not have the drop plugin loaded.");
							}
						} else {
							_this.drag(function(e, properties) {
								var data = _this.data("roundabout"), delta = (data.dragAxis.toLowerCase() === "x") ? "deltaX" : "deltaY";
								methods.stopAnimation.apply(_this);
								methods.setBearing.apply(_this, [data.dragBearing + properties[delta] / data.dragFactor]);
							}).drop(function(e) {
								var data = _this.data("roundabout"), method = methods.getAnimateToMethod(data.dropAnimateTo);
								methods.allowAnimation.apply(_this);
								methods[method].apply(_this, [data.dropDuration, data.dropEasing, data.dropCallback]);
								data.dragBearing = data.period * methods.getNearestChild.apply(_this);
							});
						}

						// on mobile
						_this.each(function() {
							var element = $(this).get(0),
								data = $(this).data("roundabout"),
								page = (data.dragAxis.toLowerCase() === "x") ? "pageX" : "pageY",
								method = methods.getAnimateToMethod(data.dropAnimateTo);

							// some versions of IE don't like this
							if (element.addEventListener) {
								element.addEventListener("touchstart", function(e) {
									data.touchMoveStartPosition = e.touches[0][page];
								}, false);

								element.addEventListener("touchmove", function(e) {
									var delta = (e.touches[0][page] - data.touchMoveStartPosition) / data.dragFactor;
									e.preventDefault();
									methods.stopAnimation.apply($(this));
									methods.setBearing.apply($(this), [data.dragBearing + delta]);
								}, false);

								element.addEventListener("touchend", function(e) {
									e.preventDefault();
									methods.allowAnimation.apply($(this));
									method = methods.getAnimateToMethod(data.dropAnimateTo);
									methods[method].apply($(this), [data.dropDuration, data.dropEasing, data.dropCallback]);
									data.dragBearing = data.period * methods.getNearestChild.apply($(this));
								}, false);
							}
						});
					}
					// 重新布局渲染
					if (settings.responsive) {
						$(window).resize(function() {
							methods.relayoutChildren.apply(_this);
						});
					}
				}

				// 子元素初始化开始
				methods.initChildren.apply(_this, [callback, relayout]);
			});
		},

		// 子元素初始化
		initChildren: function(callback, relayout) {
			var _this = $(this), data = _this.data("roundabout");
				
			callback = callback || function() {};
			_this.children(data.childSelector).each(function(i) {
				var startWidth, startHeight, startFontSize, degrees = methods.getPlacement.apply(_this, [i]);

				// 根据当前data数据重新布局
				if (relayout) {
					startWidth = $(this).data("roundabout").startWidth;
					startHeight = $(this).data("roundabout").startHeight;
					startFontSize = $(this).data("roundabout").startFontSize;
				}

				$(this).addClass("roundabout-moveable-item").css("position", "absolute").data("roundabout", {
					startWidth: startWidth || $(this).width(),
					startHeight: startHeight || $(this).height(),
					startFontSize: startFontSize || parseInt($(this).css("font-size"), 10),
					degrees: degrees,
					backDegrees: methods.normalize.apply(null, [degrees - 180]),
					childNumber: i,
					currentScale: 1,
					parent: _this
				});
			});

			methods.updateChildren.apply(_this);

			// 是否自动切换
			data.autoplay && methods.startAutoplay.apply(_this);

			_this.trigger('ready');
			callback.apply(_this);
			return _this;
		},

		// 子元素定位到合适的位置
		updateChildren: function() {
			return this.each(function() {
				var _this = $(this), data = _this.data("roundabout"), inFocus = -1,
					info = {
						bearing: data.bearing,
						tilt: data.tilt,
						stage: {
							width: Math.floor($(this).width() * 0.9),
							height: Math.floor($(this).height() * 0.9)
						},
						animating: data.animating,
						inFocus: data.childInFocus,
						focusBearingRadian: methods.degToRad.apply(null, [data.focusBearing]),
						shape: $.roundaboutShapes[data.shape] || $.roundaboutShapes[$.roundaboutShapes.def]
					};

				info.midStage = {
					width: info.stage.width / 2,
					height: info.stage.height / 2
				};

				info.nudge = {
					width: info.midStage.width + (info.stage.width * 0.05),
					height: info.midStage.height + (info.stage.height * 0.05)
				};

				info.zValues = {
					min: data.minZ,
					max: data.maxZ,
					diff: data.maxZ - data.minZ
				};

				info.opacity = {
					min: data.minOpacity,
					max: data.maxOpacity,
					diff: data.maxOpacity - data.minOpacity
				};

				info.scale = {
					min: data.minScale,
					max: data.maxScale,
					diff: data.maxScale - data.minScale
				};

				// 更新子元素位置
				_this.children(data.childSelector).each(function(i) {
					if (methods.updateChild.apply(_this, [$(this), info, i, function() { $(this).trigger('ready'); }]) && (!info.animating || data.lastAnimationStep)) {
						inFocus = i;
						$(this).addClass("roundabout-in-focus");
					} else {
						$(this).removeClass("roundabout-in-focus");
					}
				});

				if (inFocus !== info.inFocus) {
					if (data.triggerBlurEvents) { _this.children(data.childSelector).eq(info.inFocus).trigger("blur"); }
					data.childInFocus = inFocus;
					if (data.triggerFocusEvents && inFocus !== -1) { _this.children(data.childSelector).eq(inFocus).trigger("focus"); }
				}

				_this.trigger("childrenUpdated");
			});
		},

		// 重新定位子元素到新的位置
		updateChild: function(childElement, info, childPos, callback) {
			var factors, _this = this, child = $(childElement), data = child.data("roundabout"), out = [], rad = methods.degToRad.apply(null, [(360.0 - data.degrees) + info.bearing]);

			callback = callback || function() {};

			// 调整弧度为介于0和Math.PI* 2
			rad = methods.normalizeRad.apply(null, [rad]);

			// 得到形状因子
			factors = info.shape(rad, info.focusBearingRadian, info.tilt);

			// 修正
			factors.scale = (factors.scale > 1) ? 1 : factors.scale;
			factors.adjustedScale = (info.scale.min + (info.scale.diff * factors.scale)).toFixed(4);
			factors.width = (factors.adjustedScale * data.startWidth).toFixed(4);
			factors.height = (factors.adjustedScale * data.startHeight).toFixed(4);

			// 更新项目
			child.css({
				left: ((factors.x * info.midStage.width + info.nudge.width) - factors.width / 2.0).toFixed(0) + "px",
				top: ((factors.y * info.midStage.height + info.nudge.height) - factors.height / 2.0).toFixed(0) + "px",
				width: factors.width + "px",
				height: factors.height + "px",
				opacity: (info.opacity.min + (info.opacity.diff * factors.scale)).toFixed(2),
				zIndex: Math.round(info.zValues.min + (info.zValues.diff * factors.z)),
				fontSize: (factors.adjustedScale * data.startFontSize).toFixed(1) + "px"
			});
			data.currentScale = factors.adjustedScale;

			// 用于调试
			if (_this.data("roundabout").debug) {
				out.push("<div style=\"font-weight: normal; font-size: 10px; padding: 2px; width: " + child.css("width") + "; background-color: #ffc;\">");
				out.push("<strong style=\"font-size: 12px; white-space: nowrap;\">Child " + childPos + "</strong><br />");
				out.push("<strong>left:</strong> " + child.css("left") + "<br />");
				out.push("<strong>top:</strong> " + child.css("top") + "<br />");
				out.push("<strong>width:</strong> " + child.css("width") + "<br />");
				out.push("<strong>opacity:</strong> " + child.css("opacity") + "<br />");
				out.push("<strong>height:</strong> " + child.css("height") + "<br />");
				out.push("<strong>z-index:</strong> " + child.css("z-index") + "<br />");
				out.push("<strong>font-size:</strong> " + child.css("font-size") + "<br />");
				out.push("<strong>scale:</strong> " + child.data("roundabout").currentScale);
				out.push("</div>");

				child.html(out.join(""));
			}

			// 触发事件
			child.trigger("reposition");

			// 回调
			callback.apply(_this);

			return methods.isInFocus.apply(_this, [data.degrees]);
		},

		// 设置回旋轴承
		setBearing: function(bearing, callback) {
			callback = callback || function() {};
			bearing = methods.normalize.apply(null, [bearing]);

			this.each(function() {
				var diff, lowerValue, higherValue, _this = $(this), data = _this.data("roundabout"), oldBearing = data.bearing;
				// 设置
				data.bearing = bearing;
				_this.trigger("bearingSet");
				methods.updateChildren.apply(_this);

				// 动画
				diff = Math.abs(oldBearing - bearing);
				if (!data.animating || diff > 180) { return; }

				// check to see if any of the children went through the back
				diff = Math.abs(oldBearing - bearing);
				_this.children(data.childSelector).each(function(i) {
					var eventType;
					if (methods.isChildBackDegreesBetween.apply($(this), [bearing, oldBearing])) {
						eventType = (oldBearing > bearing) ? "Clockwise" : "Counterclockwise";
						$(this).trigger("move" + eventType + "ThroughBack");
					}
				});
			});

			// 调用给定的回调
			callback.apply(this);
			return this;
		},

		// 调整回旋轴承 
		adjustBearing: function(delta, callback) {
			callback = callback || function() {};
			if (delta === 0) { return this; }

			this.each(function() {
				methods.setBearing.apply($(this), [$(this).data("roundabout").bearing + delta]);
			});

			callback.apply(this);
			return this;
		},

		// 设置倾斜 
		setTilt: function(tilt, callback) {
			callback = callback || function() {};

			this.each(function() {
				$(this).data("roundabout").tilt = tilt;
				methods.updateChildren.apply($(this));
			});

			// 调用给定的回调
			callback.apply(this);
			return this;
		},

		// 调整倾斜 
		adjustTilt: function(delta, callback) {
			callback = callback || function() {};

			this.each(function() {
				methods.setTilt.apply($(this), [$(this).data("roundabout").tilt + delta]);
			});

			callback.apply(this);
			return this;
		},

		// 动画轴承 
		animateToBearing: function(bearing, duration, easing, passedData, callback) {
			var now = (new Date()).getTime();

			callback = callback || function() {};
			// find callback function in arguments
			if ($.isFunction(passedData)) {
				callback = passedData;
				passedData = null;
			} else if ($.isFunction(easing)) {
				callback = easing;
				easing = null;
			} else if ($.isFunction(duration)) {
				callback = duration;
				duration = null;
			}

			this.each(function() {
				var timer, easingFn, newBearing, _this = $(this), data = _this.data("roundabout"), thisDuration = (!duration) ? data.duration : duration, thisEasingType = (easing) ? easing : data.easing || "swing";

				if (!passedData) {
					passedData = {
						timerStart: now,
						start: data.bearing,
						totalTime: thisDuration
					};
				}

				// 更新计时器
				timer = now - passedData.timerStart;

				if (data.stopAnimation) {
					methods.allowAnimation.apply(_this);
					data.animating = false;
					return;
				}

				if (timer < thisDuration) {
					if (!data.animating) {
						_this.trigger("animationStart");
					}

					data.animating = true;

					if (typeof $.easing.def === "string") {
						easingFn = $.easing[thisEasingType] || $.easing[$.easing.def];
						newBearing = easingFn(null, timer, passedData.start, bearing - passedData.start, passedData.totalTime);
					} else {
						newBearing = $.easing[thisEasingType]((timer / passedData.totalTime), timer, passedData.start, bearing - passedData.start, passedData.totalTime);
					}

					newBearing = methods.normalize.apply(null, [newBearing]);
					data.dragBearing = newBearing;

					methods.setBearing.apply(_this, [newBearing, function() {
						setTimeout(function() { // done with a timeout so that each step is displayed
							methods.animateToBearing.apply(_this, [bearing, thisDuration, thisEasingType, passedData, callback]);
						}, 0);
					}]);
				} else {
					if (data.animating) {
						_this.trigger("animationEnd");
					}

					data.lastAnimationStep = true;

					bearing = methods.normalize.apply(null, [bearing]);
					methods.setBearing.apply(_this, [bearing]);
					data.animating = false;
					data.lastAnimationStep = false;
					data.dragBearing = bearing;

					callback.apply(_this);
				}
			});

			return this;
		},

		// 动画附近的子元素
		animateToNearbyChild: function(passedArgs, which) {
			var duration = passedArgs[0], easing = passedArgs[1], callback = passedArgs[2] || function() {};

			if ($.isFunction(easing)) {
				callback = easing;
				easing = null;
			} else if ($.isFunction(duration)) {
				callback = duration;
				duration = null;
			}

			return this.each(function() {
				var j, range, _this = $(this), data = _this.data("roundabout"), bearing = (!data.reflect) ? data.bearing % 360 : data.bearing, length = _this.children(data.childSelector).length;

				if (!data.animating) {
					if ((data.reflect && which === "previous") || (!data.reflect && which === "next")) {
						bearing = (Math.abs(bearing) < data.floatComparisonThreshold) ? 360 : bearing;

						for (j = 0; j < length; j += 1) {
							range = {
								lower: (data.period * j),
								upper: (data.period * (j + 1))
							};
							range.upper = (j === length - 1) ? 360 : range.upper;

							if (bearing <= Math.ceil(range.upper) && bearing >= Math.floor(range.lower)) {
								if (length === 2 && bearing === 360) {
									methods.animateToDelta.apply(_this, [-180, duration, easing, callback]);
								} else {
									methods.animateBearingToFocus.apply(_this, [range.lower, duration, easing, callback]);
								}
								break;
							}
						}
					} else {
						bearing = (Math.abs(bearing) < data.floatComparisonThreshold || 360 - Math.abs(bearing) < data.floatComparisonThreshold) ? 0 : bearing;

						for (j = length - 1; j >= 0; j -= 1) {
							range = {
								lower: data.period * j,
								upper: data.period * (j + 1)
							};
							range.upper = (j === length - 1) ? 360 : range.upper;

							if (bearing >= Math.floor(range.lower) && bearing < Math.ceil(range.upper)) {
								if (length === 2 && bearing === 360) {
									methods.animateToDelta.apply(_this, [180, duration, easing, callback]);
								} else {
									methods.animateBearingToFocus.apply(_this, [range.upper, duration, easing, callback]);
								}
								break;
							}
						}
					}
				}
			});
		},

		// 动画最近的子元素
		animateToNearestChild: function(duration, easing, callback) {
			callback = callback || function() {};

			if ($.isFunction(easing)) {
				callback = easing;
				easing = null;
			} else if ($.isFunction(duration)) {
				callback = duration;
				duration = null;
			}

			return this.each(function() {
				var nearest = methods.getNearestChild.apply($(this));
				methods.animateToChild.apply($(this), [nearest, duration, easing, callback]);
			});
		},

		// 动画元素
		animateToChild: function(childPosition, duration, easing, callback) {
			callback = callback || function() {};

			if ($.isFunction(easing)) {
				callback = easing;
				easing = null;
			} else if ($.isFunction(duration)) {
				callback = duration;
				duration = null;
			}

			return this.each(function() {
				var child, _this = $(this), data = _this.data("roundabout");
				if (data.childInFocus !== childPosition && !data.animating) {
					child = _this.children(data.childSelector).eq(childPosition);
					methods.animateBearingToFocus.apply(_this, [child.data("roundabout").degrees, duration, easing, callback]);
				}
			});
		},

		// 下一个动画元素
		animateToNextChild: function(duration, easing, callback) {
			return methods.animateToNearbyChild.apply(this, [arguments, "next"]);
		},

		// 上一个动画元素
		animateToPreviousChild: function(duration, easing, callback) {
			return methods.animateToNearbyChild.apply(this, [arguments, "previous"]);
		},

		// 动画范围
		animateToDelta: function(degrees, duration, easing, callback) {
			callback = callback || function() {};

			if ($.isFunction(easing)) {
				callback = easing;
				easing = null;
			} else if ($.isFunction(duration)) {
				callback = duration;
				duration = null;
			}

			return this.each(function() {
				var delta = $(this).data("roundabout").bearing + degrees;
				methods.animateToBearing.apply($(this), [delta, duration, easing, callback]);
			});
		},

		// 动画轴承焦点
		animateBearingToFocus: function(degrees, duration, easing, callback) {
			callback = callback || function() {};

			if ($.isFunction(easing)) {
				callback = easing;
				easing = null;
			} else if ($.isFunction(duration)) {
				callback = duration;
				duration = null;
			}

			return this.each(function() {
				var delta = $(this).data("roundabout").bearing - degrees;
				delta = (Math.abs(360 - delta) < Math.abs(delta)) ? 360 - delta : -delta;
				delta = (delta > 180) ? -(360 - delta) : delta;

				if (delta !== 0) {
					methods.animateToDelta.apply($(this), [delta, duration, easing, callback]);
				}
			});
		},

		// 停止播放动画
		stopAnimation: function() {
			return this.each(function() {
				$(this).data("roundabout").stopAnimation = true;
			});
		},

		// 开始播放动画
		allowAnimation: function() {
			return this.each(function() {
				$(this).data("roundabout").stopAnimation = false;
			});
		},

		// 开始自动播放动画
		startAutoplay: function(callback) {
			return this.each(function() {
				var _this = $(this), data = _this.data("roundabout");

				callback = callback || data.autoplayCallback || function() {};

				clearInterval(data.autoplayInterval);
				data.autoplayInterval = setInterval(function() {
					methods.animateToNextChild.apply(_this, [callback]);
				}, data.autoplayDuration);
				data.autoplayIsRunning = true;

				_this.trigger("autoplayStart");
			});
		},

		// 停止自动播放动画
		stopAutoplay: function(keepAutoplayBindings) {
			return this.each(function() {
				clearInterval($(this).data("roundabout").autoplayInterval);
				$(this).data("roundabout").autoplayInterval = null;
				$(this).data("roundabout").autoplayIsRunning = false;

				// 防止 autoplayPauseOnHover 无法重新启动自动播放
				if (!keepAutoplayBindings) {
					$(this).off(".autoplay")
				}

				$(this).trigger("autoplayStop");
			});
		},

		// 切换自动播放动画
		toggleAutoplay: function(callback) {
			return this.each(function() {
				var _this = $(this), data = _this.data("roundabout");

				callback = callback || data.autoplayCallback || function() {};

				if (!methods.isAutoplaying.apply($(this))) {
					methods.startAutoplay.apply($(this), [callback]);
				} else {
					methods.stopAutoplay.apply($(this), [callback]);
				}
			});
		},

		// 自动播放动画
		isAutoplaying: function() {
			return (this.data("roundabout").autoplayIsRunning);
		},

		// 更改自动播放时间 
		changeAutoplayDuration: function(duration) {
			return this.each(function() {
				var _this = $(this), data = _this.data("roundabout");

				data.autoplayDuration = duration;

				if (methods.isAutoplaying.apply(_this)) {
					methods.stopAutoplay.apply(_this);
					setTimeout(function() {
						methods.startAutoplay.apply(_this);
					}, 10);
				}
			});
		},

		/* ----------------------------------------------------------------------- */
		normalize: function(degrees) {
			var inRange = degrees % 360.0;
			return (inRange < 0) ? 360 + inRange : inRange;
		},

		normalizeRad: function(radians) {
			while (radians < 0) {
				radians += (Math.PI * 2);
			}

			while (radians > (Math.PI * 2)) {
				radians -= (Math.PI * 2);
			}

			return radians;
		},

		isChildBackDegreesBetween: function(value1, value2) {
			var backDegrees = $(this).data("roundabout").backDegrees;

			if (value1 > value2) {
				return (backDegrees >= value2 && backDegrees < value1);
			} else {
				return (backDegrees < value2 && backDegrees >= value1);
			}
		},

		// 动画执行方法 
		getAnimateToMethod: function(effect) {
			effect = effect.toLowerCase();
			if (effect === "next") {
				return "animateToNextChild";
			} else if (effect === "previous") {
				return "animateToPreviousChild";
			}
			return "animateToNearestChild";
		},

		// 重新布局子元素
		relayoutChildren: function() {
			return this.each(function() {
				var _this = $(this), settings = $.extend({}, _this.data("roundabout"));

				settings.startingChild = _this.data("roundabout").childInFocus;
				methods.init.apply(_this, [settings, null, true]);
			});
		},

		// 获得最近的元素
		getNearestChild: function() {
			var _this = $(this), data = _this.data("roundabout"), length = _this.children(data.childSelector).length;

			if (!data.reflect) {
				return ((length) - (Math.round(data.bearing / data.period) % length)) % length;
			} else {
				return (Math.round(data.bearing / data.period) % length);
			}
		},

		// 度转换为弧度
		degToRad: function(degrees) {
			return methods.normalize.apply(null, [degrees]) * Math.PI / 180.0;
		},

		getPlacement: function(child) {
			var data = this.data("roundabout");
			return (!data.reflect) ? 360.0 - (data.period * child) : data.period * child;
		},

		isInFocus: function(degrees) {
			var diff, _this = this, data = _this.data("roundabout"), bearing = methods.normalize.apply(null, [data.bearing]);

			degrees = methods.normalize.apply(null, [degrees]);
			diff = Math.abs(bearing - degrees);

			// this calculation gives a bit of room for javascript float rounding
			// errors, it looks on both 0deg and 360deg ends of the spectrum
			return (diff <= data.floatComparisonThreshold || diff >= 360 - data.floatComparisonThreshold);
		}
	};

	$.fn.roundabout = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === "object" || $.isFunction(method) || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error("Method " + method + " does not exist for jQuery.roundabout.");
		}
	};
});